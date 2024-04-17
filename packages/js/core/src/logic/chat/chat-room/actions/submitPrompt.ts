import {submitPrompt} from '../../../../../../../shared/src/services/submitPrompt/submitPromptImpl';
import {DataTransferMode} from '../../../../../../../shared/src/types/adapters/chat/chatAdapter';
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
    dataTransferMode,
}: {
    dataTransferMode?: DataTransferMode;
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
            promptBoxInstance.setDomProps({
                ...currentPromptBoxProps,
                status: 'submitting',
            });

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

            const message = conversation.getMessageById(inMessageId);
            if (!message) {
                conversation.removeMessage(outMessageId);
                throw new Error(`Message with id ${inMessageId} not found`);
            }

            if (result.dataTransferMode === 'fetch') {
                result.observable.on('aiMessageReceived', (aiMessage) => {
                    console.dir(aiMessage.content);
                    message.setContent(aiMessage.content);
                    conversation.updateConversationContent({role: 'ai', message: aiMessage.content});
                    context.emit('messageReceived', aiMessage.content);
                });

                result.observable.on('complete', () => {
                    resetPromptBox(true);
                });
            } else {
                result.observable.on('aiChunkReceived', (aiMessageChunk) => {
                    message.appendContent(aiMessageChunk);
                });

                result.observable.on('complete', () => {
                    message.commitContent();
                    resetPromptBox(true);

                    if (message.content) {
                        // Only add user message to conversation content (used for history, and not displayed)
                        // if the message was sent successfully and a response was received.
                        conversation.updateConversationContent({role: 'user', message: messageToSend});
                        conversation.updateConversationContent(
                            {role: 'ai', message: message.content as any},
                        );
                        context.emit('messageReceived', message.content as any);
                    }
                });
            }
        } catch (error) {
            warn(error);
            resetPromptBox(false);
        }
    };
};
