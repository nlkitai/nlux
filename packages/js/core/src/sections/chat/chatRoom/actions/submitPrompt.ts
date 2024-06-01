import {AutoScrollController} from '@shared/interactions/autoScroll/type';
import {submitPrompt} from '@shared/services/submitPrompt/submitPromptImpl';
import {ChatAdapterExtras} from '@shared/types/adapters/chat/chatAdapterExtras';
import {ChatSegmentItem} from '@shared/types/chatSegment/chatSegment';
import {NLErrors} from '@shared/types/exceptions/errors';
import {domOp} from '@shared/utils/dom/domOp';
import {warn} from '@shared/utils/warn';
import {ControllerContext} from '../../../../types/controllerContext';
import {CompConversation} from '../../conversation/conversation.model';
import {CompComposer} from '../../composer/composer.model';

export const submitPromptFactory = <
    AiMsg
>({
      context,
      composerInstance,
      conversation,
      autoScrollController,
      messageToSend,
      resetComposer,
      setComposerAsWaiting,
  }: {
    context: ControllerContext<AiMsg>;
    composerInstance: CompComposer<AiMsg>;
    conversation: CompConversation<AiMsg>;
    autoScrollController?: AutoScrollController;
    messageToSend: string;
    resetComposer: (resetTextInput?: boolean) => void;
    setComposerAsWaiting: () => void;
}) => {
    return () => {
        const segmentId = conversation.addChatSegment();

        try {
            // Disable prompt while sending message
            const currentComposerProps = composerInstance.getProp('domCompProps');
            composerInstance.setDomProps({...currentComposerProps, status: 'submitting'});

            // Build request and submit prompt
            const extras: ChatAdapterExtras<AiMsg> = {
                aiChatProps: context.aiChatProps,
                conversationHistory: conversation.getConversationContentForAdapter(
                    context.aiChatProps?.conversationOptions?.historyPayloadSize,
                ),
            };

            const result = submitPrompt(
                messageToSend,
                context.adapter,
                extras,
            );

            // Listen to observable events
            // Always listen to error event
            result.observable.on('error', (errorId, errorObject) => {
                conversation.removeChatSegment(segmentId);
                autoScrollController?.handleChatSegmentRemoved(segmentId);
                resetComposer(false);

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

            if (result.dataTransferMode === 'batch') {
                // In batch mode — Listen to aiMessageReceived event and complete event
                result.observable.on('aiMessageReceived', (aiMessage) => {
                    const isStringContent = typeof aiMessage.content === 'string';
                    const newAiMessage = {
                        ...aiMessage,
                        // When content is a string, we stream is instead of adding it into the chat segment
                        content: (isStringContent ? '' : aiMessage.content),
                    } as ChatSegmentItem<AiMsg>;

                    conversation.addChatItem(segmentId, newAiMessage);
                    if (isStringContent) {
                        conversation.addChunk(
                            segmentId,
                            newAiMessage.uid,
                            aiMessage.content,
                            aiMessage.serverResponse,
                        );
                    }

                    conversation.completeChatSegment(segmentId);
                    context.emit('messageReceived', {
                        uid: aiMessage.uid,
                        message: aiMessage.content,
                    });

                    resetComposer(true);
                });
            } else {
                result.observable.on('aiMessageStreamStarted', (aiMessageStream) => {
                    conversation.addChatItem(segmentId, aiMessageStream);
                    setComposerAsWaiting();
                    context.emit('messageStreamStarted', {uid: aiMessageStream.uid});
                });

                result.observable.on('aiChunkReceived', (item) => {
                    const {messageId, chunk, serverResponse} = item;
                    conversation.addChunk(segmentId, messageId, chunk, serverResponse);
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

                    resetComposer(false);
                });
            }
        } catch (error) {
            warn(error);
            resetComposer(false);
        }
    };
};
