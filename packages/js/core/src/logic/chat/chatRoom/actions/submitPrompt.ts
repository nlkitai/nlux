import {AutoScrollController} from '../../../../../../../shared/src/interactions/autoScroll/type';
import {submitPrompt} from '../../../../../../../shared/src/services/submitPrompt/submitPromptImpl';
import {ChatAdapterExtras} from '../../../../../../../shared/src/types/adapters/chat/chatAdapterExtras';
import {ChatSegmentItem} from '../../../../../../../shared/src/types/chatSegment/chatSegment';
import {NLErrors} from '../../../../../../../shared/src/types/exceptions/errors';
import {domOp} from '../../../../../../../shared/src/utils/dom/domOp';
import {warn} from '../../../../../../../shared/src/utils/warn';
import {ControllerContext} from '../../../../types/controllerContext';
import {CompConversation} from '../../conversation/conversation.model';
import {CompPromptBox} from '../../promptBox/promptBox.model';

export const submitPromptFactory = <AiMsg>({
    context,
    promptBoxInstance,
    conversation,
    autoScrollController,
    messageToSend,
    resetPromptBox,
    setPromptBoxAsWaiting,
}: {
    context: ControllerContext<AiMsg>;
    promptBoxInstance: CompPromptBox<AiMsg>;
    conversation: CompConversation<AiMsg>;
    autoScrollController?: AutoScrollController;
    messageToSend: string;
    resetPromptBox: (resetTextInput?: boolean) => void;
    setPromptBoxAsWaiting: () => void;
}) => {
    return () => {
        const segmentId = conversation.addChatSegment();

        try {
            // Disable prompt while sending message
            const currentPromptBoxProps = promptBoxInstance.getProp('domCompProps');
            promptBoxInstance.setDomProps({...currentPromptBoxProps, status: 'submitting'});

            // Build request and submit prompt
            const extras: ChatAdapterExtras<AiMsg> = {
                aiChatProps: context.aiChatProps,
                conversationHistory: conversation.getConversationContentForAdapter(
                    context.aiChatProps?.conversationOptions?.historyPayloadSize,
                ),
            };
            const result = submitPrompt(messageToSend, context.adapter, extras);

            // Listen to observable events
            // Always listen to error event
            result.observable.on('error', (errorId, errorObject) => {
                conversation.removeChatSegment(segmentId);
                autoScrollController?.handleChatSegmentRemoved(segmentId);
                resetPromptBox(false);

                context.exception(errorId);
                context.emit('error', {
                    errorId,
                    message: NLErrors[errorId],
                    errorObject,
                });
            });

            result.observable.on('userMessageReceived', (userMessage) => {
                conversation.addChatItem(segmentId, userMessage);
                context.emit('messageSent', {uid: userMessage.uid, message: userMessage.content});

                domOp(() => {
                    if (autoScrollController) {
                        const chatSegmentContainer = conversation.getChatSegmentContainer(segmentId);
                        if (chatSegmentContainer) {
                            autoScrollController.handleNewChatSegmentAdded(segmentId, chatSegmentContainer);
                        }
                    }
                });
            });

            if (result.dataTransferMode === 'fetch') {
                // In fetch mode — Listen to aiMessageReceived event and complete event
                result.observable.on('aiMessageReceived', (aiMessage) => {
                    const isStringContent = typeof aiMessage.content === 'string';
                    const newAiMessage = {
                        ...aiMessage,
                        // When content is a string, we stream is instead of adding it into the chat segment
                        content: (isStringContent ? '' : aiMessage.content),
                    } as ChatSegmentItem<AiMsg>;

                    conversation.addChatItem(segmentId, newAiMessage);
                    if (isStringContent) {
                        domOp(() => conversation.addChunk(
                            segmentId,
                            newAiMessage.uid,
                            aiMessage.content as string,
                        ));
                    }

                    conversation.completeChatSegment(segmentId);
                    context.emit('messageReceived', {
                        uid: aiMessage.uid,
                        message: aiMessage.content,
                    });

                    resetPromptBox(true);
                });
            } else {
                result.observable.on('aiMessageStreamStarted', (aiMessageStream) => {
                    conversation.addChatItem(segmentId, aiMessageStream);
                    setPromptBoxAsWaiting();
                    context.emit('messageStreamStarted', {uid: aiMessageStream.uid});
                });

                result.observable.on('aiChunkReceived', (aiMessageChunk, chatItemId) => {
                    conversation.addChunk(segmentId, chatItemId, aiMessageChunk);
                });

                result.observable.on('aiMessageStreamed', (aiMessage) => {
                    if (aiMessage.status === 'complete') {
                        context.emit('messageReceived', {
                            uid: aiMessage.uid,
                            // We only pass the response to custom renderer when the status is 'complete'.
                            message: aiMessage.content as AiMsg,
                        });
                    }
                });

                result.observable.on('complete', () => {
                    conversation.completeChatSegment(segmentId);

                    resetPromptBox(false);
                });
            }
        } catch (error) {
            warn(error);
            resetPromptBox(false);
        }
    };
};
