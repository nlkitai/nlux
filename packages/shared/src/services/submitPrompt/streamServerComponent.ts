import {ChatSegmentUserMessage} from '../../types/chatSegment/chatSegmentUserMessage';
import {ChatAdapterExtras} from '../../types/adapters/chat/chatAdapterExtras';
import {
    AiServerComponentStreamedCallback,
    AiServerComponentStreamStartedCallback,
    ChatSegmentCompleteCallback,
    ChatSegmentErrorCallback,
} from '../../types/chatSegment/chatSegmentEvents';
import {
    ServerComponentChatAdapter,
    StreamedServerComponent,
} from '../../types/adapters/chat/serverComponentChatAdapter';
import {uid} from '../../utils/uid';
import {AiStreamedServerComponentMessage} from '../../types/chatSegment/chatSegmentAiMessage';
import {triggerAsyncCallback} from './utils/triggerAsyncCallback';
import {warn} from '../../utils/warn';
import {NLErrorId} from '../../types/exceptions/errors';
import {ChatSegment} from '../../types/chatSegment/chatSegment';

export const submitAndStreamServerComponentResponse = <AiMsg>(
    segmentId: string,
    userMessage: ChatSegmentUserMessage,
    adapter: ServerComponentChatAdapter<AiMsg>,
    extras: ChatAdapterExtras<AiMsg>,
    aiServerComponentStreamStartedCallbacks: Set<AiServerComponentStreamStartedCallback>,
    aiServerComponentStreamedCallbacks: Set<AiServerComponentStreamedCallback>,
    chatSegmentCompleteCallbacks: Set<ChatSegmentCompleteCallback<AiMsg>>,
    chatSegmentExceptionCallbacks: Set<ChatSegmentErrorCallback>,
): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            const prompt = userMessage.content;
            const responseUid = uid();
            const participantRole = 'assistant';
            const status: 'streaming' | 'complete' | 'error' = 'streaming';
            const time = new Date();
            const dataTransferMode = 'stream';

            let aiResponse: AiStreamedServerComponentMessage | undefined = undefined;
            let serverComponent: StreamedServerComponent | undefined = undefined;

            const handleComplete = () => {
                //
                // We emit the AI message received event.
                //
                triggerAsyncCallback(() => {
                    aiServerComponentStreamedCallbacks.forEach((callback) => {
                        if (aiResponse && serverComponent) {
                            callback({
                                ...aiResponse,
                                content: serverComponent,
                                status: 'complete',
                            });
                        }
                    });
                }, 20);

                //
                // We emit the chat segment complete event.
                //
                const updatedChatSegment: ChatSegment<AiMsg> = {
                    uid: segmentId,
                    status: 'complete',
                    items: [
                        userMessage,
                        aiResponse!,
                    ],
                };

                triggerAsyncCallback(() => {
                    chatSegmentCompleteCallbacks.forEach((callback) => {
                        callback(updatedChatSegment);
                    });

                    resolve();
                }, 20);
            };

            const handleError = () => {
                chatSegmentExceptionCallbacks.forEach((callback) => {
                    callback('failed-to-stream-server-component', new Error('Failed to load content'));
                });
            };

            serverComponent = adapter.streamServerComponent!(
                prompt,
                extras,
                {
                    onServerComponentReceived: handleComplete,
                    onError: handleError,
                },
            );

            aiResponse = {
                uid: responseUid,
                content: serverComponent,
                contentType: 'server-component',
                participantRole,
                status,
                time,
                dataTransferMode,
            };

            //
            // We emit the AI message received event.
            //
            triggerAsyncCallback(() => {
                aiServerComponentStreamStartedCallbacks.forEach((callback) => {
                    callback(aiResponse);
                });
            }, 10);
        } catch (error) {
            warn(error);

            const errorObject = error instanceof Error
                ? error
                : (
                    typeof error === 'string' ? new Error(error) : new Error('Unknown error')
                );

            triggerAsyncCallback(() => {
                const errorId: NLErrorId = 'failed-to-load-content';
                chatSegmentExceptionCallbacks
                    .forEach((callback) => callback(errorId, errorObject));
            });
        }
    });
};
