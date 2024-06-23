import {ChatAdapter, StreamingAdapterObserver} from '../../types/adapters/chat/chatAdapter';
import {ChatAdapterExtras} from '../../types/adapters/chat/chatAdapterExtras';
import {isStandardChatAdapter, StandardChatAdapter} from '../../types/adapters/chat/standardChatAdapter';
import {ChatSegment} from '../../types/chatSegment/chatSegment';
import {AiStreamedMessage} from '../../types/chatSegment/chatSegmentAiMessage';
import {
    AiMessageChunkReceivedCallback,
    AiMessageStreamedCallback,
    AiMessageStreamStartedCallback,
    ChatSegmentCompleteCallback,
    ChatSegmentErrorCallback,
} from '../../types/chatSegment/chatSegmentEvents';
import {ChatSegmentUserMessage} from '../../types/chatSegment/chatSegmentUserMessage';
import {NLErrorId} from '../../types/exceptions/errors';
import {uid} from '../../utils/uid';
import {warn} from '../../utils/warn';
import {triggerAsyncCallback} from './utils/triggerAsyncCallback';

export const submitAndStreamTextResponse = <AiMsg>(
    segmentId: string,
    userMessage: ChatSegmentUserMessage,
    adapter: ChatAdapter<AiMsg> | StandardChatAdapter<AiMsg>,
    extras: ChatAdapterExtras<AiMsg>,
    aiMessageStreamStartedCallbacks: Set<AiMessageStreamStartedCallback<AiMsg>>,
    aiMessageStreamedCallbacks: Set<AiMessageStreamedCallback<AiMsg>>,
    aiMessageChunkReceivedCallbacks: Set<AiMessageChunkReceivedCallback<AiMsg>>,
    chatSegmentCompleteCallbacks: Set<ChatSegmentCompleteCallback<AiMsg>>,
    chatSegmentErrorCallbacks: Set<ChatSegmentErrorCallback>,
): Promise<void> => {
    return new Promise<void>((resolve) => {
        const streamedMessageId = uid();
        const streamedContent: Array<AiMsg> = [];
        const streamedRawContent: Array<string | object | undefined> = [];

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
                        participantRole: 'assistant',
                        dataTransferMode: 'stream',
                    });
                });
            });
        };

        const isStandardAdapter = isStandardChatAdapter(adapter);
        const observer: StreamingAdapterObserver<unknown> = {
            next: (chunk: unknown) => {
                if (errorOccurred || completeOccurred) {
                    return;
                }

                let aiMsgChunk: AiMsg | undefined;
                let rawChunk: string | object | undefined;
                if (isStandardAdapter) {
                    const chunkAsRaw = chunk as string | object | undefined;

                    const adapterAsStandardAdapter = adapter as unknown as StandardChatAdapter<AiMsg>;
                    const preProcessedChunk = adapterAsStandardAdapter.preProcessAiStreamedChunk(chunkAsRaw, extras);
                    if (preProcessedChunk !== undefined && preProcessedChunk !== null) {
                        aiMsgChunk = preProcessedChunk;
                        rawChunk = chunkAsRaw;

                        streamedContent.push(aiMsgChunk);
                        streamedRawContent.push(rawChunk);
                    }
                } else {
                    // For non-standard adapters, the check pre-processed chunk is done by the adapter.
                    aiMsgChunk = chunk as AiMsg;
                    streamedContent.push(aiMsgChunk);
                }

                if (aiMsgChunk === undefined || aiMsgChunk === null) {
                    warn('Adapter returned an undefined or null value from streamText. This chunk will be ignored.');
                    return;
                }

                if (!firstChunkReceived) {
                    emitAiMessageStreamStartedEvent();
                }

                triggerAsyncCallback(() => {
                    aiMessageChunkReceivedCallbacks.forEach(callback => {
                        callback({
                            chunk: aiMsgChunk,
                            messageId: streamedMessageId,
                            serverResponse: rawChunk,
                        });
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
                    type StreamedAiMessage<AiMsg> = AiStreamedMessage<AiMsg> & {
                        status: 'complete',
                        content: Array<AiMsg>
                    };

                    const aiMessage: StreamedAiMessage<AiMsg> = {
                        uid: streamedMessageId,
                        status: 'complete',
                        content: streamedContent,
                        contentType: 'text',
                        serverResponse: undefined,
                        time: new Date(),
                        participantRole: 'assistant',
                        dataTransferMode: 'stream',
                    };

                    aiMessageStreamedCallbacks.forEach(callback => {
                        callback(aiMessage);
                    });

                    //
                    // WE RESOLVE THE PROMISE HERE
                    // Only after the AI message has been fully streamed
                    //
                    resolve();
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
                                contentType: 'text',
                                content: streamedContent,
                                serverResponse: streamedRawContent,
                                time: new Date(),
                                participantRole: 'assistant',
                                dataTransferMode: 'stream',
                            },
                        ],
                    };

                    chatSegmentCompleteCallbacks.forEach(callback => {
                        callback(updatedChatSegment);
                    });
                });
            },
            error: (error) => {
                if (errorOccurred || completeOccurred) {
                    return;
                }

                errorOccurred = true;

                //
                // EVENT: CHAT SEGMENT STREAMING ERROR
                //
                triggerAsyncCallback(() => {
                    const errorId: NLErrorId = 'failed-to-stream-content';
                    chatSegmentErrorCallbacks.forEach(callback => {
                        callback(errorId, error);
                    });

                    //
                    // WE RESOLVE THE PROMISE HERE
                    // Only after the AI message has been fully streamed
                    //
                    resolve();
                });
            },
        };

        adapter.streamText!(userMessage.content, observer, extras);
    });
};
