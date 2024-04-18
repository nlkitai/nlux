import {submitPrompt} from '../../../../../../../shared/src/services/submitPrompt/submitPromptImpl';
import {ChatAdapterExtras} from '../../../../../../../shared/src/types/adapters/chat/chatAdapterExtras';
import {warn} from '../../../../../../../shared/src/utils/warn';
import {ControllerContext} from '../../../../types/controllerContext';
import {CompConversation} from '../../conversation/conversation.model';
import {CompPromptBox} from '../../prompt-box/prompt-box.model';

export const submitPromptFactory = <AiMsg>({
    context,
    promptBoxInstance,
    conversation,
    messageToSend,
    resetPromptBox,
}: {
    context: ControllerContext<AiMsg>;
    promptBoxInstance: CompPromptBox<AiMsg>;
    conversation: CompConversation<AiMsg>;
    messageToSend: string;
    resetPromptBox: (resetTextInput?: boolean) => void;
}) => {
    return () => {
        const outMessageId = conversation.addMessage(
            'out', 'static', new Date(), messageToSend,
        );

        try {
            //
            // Disable prompt while sending message
            //
            const currentPromptBoxProps = promptBoxInstance.getProp('domCompProps');
            promptBoxInstance.setDomProps({...currentPromptBoxProps, status: 'submitting'});

            //
            // Build request and submit prompt
            //
            const extras: ChatAdapterExtras<AiMsg> = {
                aiChatProps: context.aiChatProps,
                conversationHistory: conversation.getConversationContentForAdapter(
                    context.aiChatProps?.conversationOptions?.historyPayloadSize,
                ),
            };

            const result = submitPrompt(messageToSend, context.adapter, extras);
            const inMessageId = conversation.addMessage(
                'in',
                result.dataTransferMode === 'stream' ? 'stream' : 'promise',
                new Date(),
            );

            const message = conversation.getMessageById(inMessageId);
            if (!message) {
                conversation.removeMessage(outMessageId);
                warn(`Message with id ${inMessageId} not found`);
                resetPromptBox(false);
                return;
            }

            //
            // Listen to observable events
            // Always listen to error event
            //
            result.observable.on('error', (error) => {
                conversation.removeMessage(outMessageId);
                conversation.removeMessage(inMessageId);
                resetPromptBox(false);

                context.exception('NX-AD-001');
                context.emit('error', {
                    errorId: 'NX-AD-001',
                    message: 'An error occurred while submitting prompt',
                });
            });

            // When streaming or fet is complete, update conversation content and trigger messageReceived event
            const messageContentCompleteHandler = () => {
                if (message.content) {
                    // Only add user message to conversation content (used for history, and not displayed)
                    // if the message was sent successfully and a response was received.
                    conversation.updateConversationContent({role: 'user', message: messageToSend});
                    conversation.updateConversationContent(
                        {role: 'ai', message: message.content as any},
                    );

                    context.emit('messageReceived', message.content as any);
                }
            };

            if (result.dataTransferMode === 'fetch') {
                //
                // In fetch mode — Listen to aiMessageReceived event and complete event
                //
                result.observable.on('aiMessageReceived', (aiMessage) => {
                    message.setContent(aiMessage.content);
                    messageContentCompleteHandler();
                    resetPromptBox(true);
                });
            } else {
                //
                // In stream mode — Listen to aiChunkReceived event and complete event
                //
                result.observable.on('aiChunkReceived', (aiMessageChunk) => {
                    message.appendContent(aiMessageChunk);
                });

                result.observable.on('complete', () => {
                    message.commitContent();
                    messageContentCompleteHandler();
                    resetPromptBox(true);
                });
            }
        } catch (error) {
            warn(error);
            resetPromptBox(false);
        }
    };
};
