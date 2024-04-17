import {ChatSegment} from '../../../../../../../shared/src/types/chatSegment/chatSegment';
import {AiStreamedMessage} from '../../../../../../../shared/src/types/chatSegment/chatSegmentAiMessage';
import {
    AiMessageChunkReceivedCallback,
    AiMessageStreamedCallback,
    AiMessageStreamStartedCallback,
    ChatSegmentCompleteCallback,
    ChatSegmentErrorCallback,
} from '../../../../../../../shared/src/types/chatSegment/chatSegmentEvents';
import {ChatSegmentUserMessage} from '../../../../../../../shared/src/types/chatSegment/chatSegmentUserMessage';
import {uid} from '../../../../../../../shared/src/utils/uid';
import {ChatAdapter} from '../../../../types/adapters/chat/chatAdapter';
import {ChatAdapterExtras} from '../../../../types/adapters/chat/chatAdapterExtras';
import {triggerAsyncCallback} from './utils/triggerAsyncCallback';

export const submitInStreamingMode = async <AiMsg>(
    segmentId: string,
    userMessage: ChatSegmentUserMessage,
    adapter: ChatAdapter<AiMsg>,
    extras: ChatAdapterExtras<AiMsg>,
    aiMessageStreamStartedCallbacks: Set<AiMessageStreamStartedCallback>,
    aiMessageStreamedCallbacks: Set<AiMessageStreamedCallback>,
    aiMessageChunkReceivedCallbacks: Set<AiMessageChunkReceivedCallback>,
    chatSegmentCompleteCallbacks: Set<ChatSegmentCompleteCallback<AiMsg>>,
    chatSegmentErrorCallbacks: Set<ChatSegmentErrorCallback>,
): Promise<void> => {
    const streamedMessageId: string = uid();
    let firstChunkReceived = false;
    let errorOccurred = false;
    let completeOccurred = false;

    const emitAiMessageStreamStartedEvent = () => {
        if (firstChunkReceived) {
            return;
        }

        firstChunkReceived = true;
        triggerAsyncCallback(() => {
            aiMessageStreamStartedCallbacks.forEach(callback => {
                callback({
                    uid: streamedMessageId,
                    status: 'streaming',
                    time: new Date(),
                    participantRole: 'ai',
                    dataTransferMode: 'stream',
                });
            });
        });
    };

    adapter.streamText!(userMessage.content, {
        next: (chunk: string) => {
            if (errorOccurred || completeOccurred) {
                return;
            }

            if (!firstChunkReceived) {
                emitAiMessageStreamStartedEvent();
            }

            triggerAsyncCallback(() => {
                aiMessageChunkReceivedCallbacks.forEach(callback => {
                    callback(streamedMessageId, chunk);
                });
            });
        },
        complete: () => {
            if (errorOccurred || completeOccurred) {
                return;
            }

            completeOccurred = true;

            //
            // EVENT: AI MESSAGE FULLY STREAMED
            //
            triggerAsyncCallback(() => {
                type StreamedAiMessage = AiStreamedMessage & {status: 'complete'};
                const aiMessage: StreamedAiMessage = {
                    uid: streamedMessageId,
                    status: 'complete',
                    time: new Date(),
                    participantRole: 'ai',
                    dataTransferMode: 'stream',
                };

                aiMessageStreamedCallbacks.forEach(callback => {
                    callback(aiMessage);
                });
            });

            //
            // EVENT: CHAT SEGMENT COMPLETE
            //
            triggerAsyncCallback(() => {
                const updatedChatSegment: ChatSegment<AiMsg> = {
                    uid: segmentId,
                    status: 'complete',
                    items: [
                        userMessage,
                        {
                            uid: streamedMessageId,
                            status: 'complete',
                            time: new Date(),
                            participantRole: 'ai',
                            dataTransferMode: 'stream',
                        },
                    ],
                };

                chatSegmentCompleteCallbacks.forEach(callback => {
                    callback(updatedChatSegment);
                });
            });
        },
        error: () => {
            if (errorOccurred || completeOccurred) {
                return;
            }

            errorOccurred = true;

            //
            // EVENT: CHAT SEGMENT STREAMING ERROR
            //
            triggerAsyncCallback(() => {
                chatSegmentErrorCallbacks.forEach(callback => {
                    callback('failed-to-stream-content');
                });
            });
        },
    }, extras);
};
