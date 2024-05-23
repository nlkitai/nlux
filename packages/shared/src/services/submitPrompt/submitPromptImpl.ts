import {ChatAdapter} from '../../types/adapters/chat/chatAdapter';
import {ChatAdapterExtras} from '../../types/adapters/chat/chatAdapterExtras';
import {StandardChatAdapter} from '../../types/adapters/chat/standardChatAdapter';
import {
    AiMessageChunkReceivedCallback,
    AiMessageReceivedCallback,
    AiMessageStreamedCallback,
    AiMessageStreamStartedCallback,
    ChatSegmentCompleteCallback,
    ChatSegmentErrorCallback,
    UserMessageReceivedCallback,
} from '../../types/chatSegment/chatSegmentEvents';
import {uid} from '../../utils/uid';
import {submitInBatchMode} from './submitInBatchMode';
import {submitInStreamingMode} from './submitInStreamingMode';
import {SubmitPrompt} from './submitPrompt';
import {getDataTransferModeToUse} from './utils/dataTransferModeToUse';
import {createEmptyCompleteSegment} from './utils/emptyCompleteSegment';
import {createEmptyErrorSegment} from './utils/emptyErrorSegment';
import {triggerAsyncCallback} from './utils/triggerAsyncCallback';
import {getUserMessageFromPrompt} from './utils/userMessageFromPrompt';

export const submitPrompt: SubmitPrompt = <AiMsg>(
    prompt: string,
    adapter: ChatAdapter<AiMsg> | StandardChatAdapter<AiMsg>,
    extras: ChatAdapterExtras<AiMsg>,
) => {
    //
    // We check if the prompt is empty and that the adapter supports at least one data transfer mode.
    //
    if (!prompt) {
        return createEmptyCompleteSegment<AiMsg>();
    }

    if (adapter.streamText === undefined && adapter.batchText === undefined) {
        return createEmptyErrorSegment<AiMsg>('no-data-transfer-mode-supported');
    }

    //
    // We know that we will attempt to submit the prompt to the adapter.
    // We create data structures for event listeners and submit function.
    //
    const segmentId = uid();
    const userMessage = getUserMessageFromPrompt(prompt);

    // (a.i). USER MESSAGE RECEIVED + (a.ii) CHAT SEGMENT COMPLETE + (a.iii) CHAT SEGMENT EXCEPTION
    let userMessageReceivedCallbacks: Set<UserMessageReceivedCallback> | undefined = new Set();
    let chatSegmentCompleteCallbacks: Set<ChatSegmentCompleteCallback<AiMsg>> | undefined = new Set();
    let chatSegmentExceptionCallbacks: Set<ChatSegmentErrorCallback> | undefined = new Set();

    // (b). AI MESSAGE RECEIVED
    let aiMessageReceivedCallbacks: Set<AiMessageReceivedCallback<AiMsg>> | undefined = undefined;

    // (c). AI MESSAGE STREAMED ( 3 events )
    let aiMessageStreamStartedCallbacks: Set<AiMessageStreamStartedCallback<AiMsg>> | undefined = undefined;
    let aiMessageStreamedCallbacks: Set<AiMessageStreamedCallback<AiMsg>> | undefined = undefined;
    let aiMessageChunkReceivedCallbacks: Set<AiMessageChunkReceivedCallback<AiMsg>> | undefined = undefined;

    //
    // We start by emitting a user message received event.
    //
    triggerAsyncCallback(() => {
        if (!userMessageReceivedCallbacks?.size) {
            return;
        }

        userMessageReceivedCallbacks.forEach((callback) => {
            callback(userMessage);
        });

        //
        // (a.i) — USER MESSAGE RECEIVED — NOT NEEDED ANYMORE AFTER THIS POINT.
        //
        // Since the user message can only be emitted once, we don't need to keep the callbacks around.
        // - We clear the callbacks after they have been called.
        // - We also set the set to indicate that we should not register any more callbacks.
        userMessageReceivedCallbacks.clear();
        userMessageReceivedCallbacks = undefined;
    });

    const dataTransferModeToUse = getDataTransferModeToUse(adapter);

    if (dataTransferModeToUse === 'batch') {
        // (b). AI MESSAGE RECEIVED — Only needed in batch mode.
        aiMessageReceivedCallbacks = new Set();

        submitInBatchMode(
            segmentId,
            userMessage,
            adapter,
            extras,
            aiMessageReceivedCallbacks,
            chatSegmentCompleteCallbacks,
            chatSegmentExceptionCallbacks,
        ).finally(() => {
            // Finally -> Final status of the segment after complete or error has been emitted.
            // At this point:
            //   - No more items can be added to the segment.
            //   - No more events will be emitted.
            // We remove all listeners in an async manner to ensure that all events have been emitted.
            triggerAsyncCallback(() => removeAllListeners());
        });
    } else {
        // (c). AI MESSAGE STREAMED ( 3 events ) — Only needed in streaming mode.
        aiMessageStreamStartedCallbacks = new Set();
        aiMessageStreamedCallbacks = new Set();
        aiMessageChunkReceivedCallbacks = new Set();

        submitInStreamingMode(
            segmentId,
            userMessage,
            adapter,
            extras,
            aiMessageStreamStartedCallbacks,
            aiMessageStreamedCallbacks,
            aiMessageChunkReceivedCallbacks,
            chatSegmentCompleteCallbacks,
            chatSegmentExceptionCallbacks,
        ).finally(() => {
            // Finally -> Final status of the segment after complete or error has been emitted.
            // At this point:
            //   - No more items can be added to the segment.
            //   - No more events will be emitted.
            // We remove all listeners in an async manner to ensure that all events have been emitted.
            triggerAsyncCallback(() => removeAllListeners());
        });
    }

    // Remove all listeners and destroy the segment.
    const removeAllListeners = () => {
        userMessageReceivedCallbacks?.clear();
        userMessageReceivedCallbacks = undefined;

        aiMessageReceivedCallbacks?.clear();
        aiMessageReceivedCallbacks = undefined;

        aiMessageStreamStartedCallbacks?.clear();
        aiMessageStreamStartedCallbacks = undefined;

        aiMessageStreamedCallbacks?.clear();
        aiMessageStreamedCallbacks = undefined;

        aiMessageChunkReceivedCallbacks?.clear();
        aiMessageChunkReceivedCallbacks = undefined;

        chatSegmentCompleteCallbacks?.clear();
        chatSegmentCompleteCallbacks = undefined;

        chatSegmentExceptionCallbacks?.clear();
        chatSegmentExceptionCallbacks = undefined;
    };

    return {
        segment: {
            status: 'active',
            uid: segmentId,
            items: [], // Initially empty — User message will be added in callback above.
        },
        dataTransferMode: dataTransferModeToUse,
        observable: {
            get segmentId(): string {
                return segmentId;
            },
            on: (event, callback) => {
                if (event === 'userMessageReceived' && userMessageReceivedCallbacks) {
                    userMessageReceivedCallbacks.add(
                        callback as UserMessageReceivedCallback,
                    );
                    return;
                }

                if (event === 'aiMessageReceived' && aiMessageReceivedCallbacks) {
                    aiMessageReceivedCallbacks.add(
                        callback as AiMessageReceivedCallback<AiMsg>,
                    );
                    return;
                }

                if (event === 'aiMessageStreamStarted' && aiMessageStreamStartedCallbacks) {
                    aiMessageStreamStartedCallbacks.add(
                        callback as AiMessageStreamStartedCallback<AiMsg>,
                    );
                    return;
                }

                if (event === 'aiMessageStreamed' && aiMessageStreamedCallbacks) {
                    aiMessageStreamedCallbacks.add(
                        callback as AiMessageStreamedCallback<AiMsg>,
                    );
                    return;
                }

                if (event === 'aiChunkReceived' && aiMessageChunkReceivedCallbacks) {
                    aiMessageChunkReceivedCallbacks.add(
                        callback as unknown as AiMessageChunkReceivedCallback<AiMsg>,
                    );
                    return;
                }

                if (event === 'complete' && chatSegmentCompleteCallbacks) {
                    chatSegmentCompleteCallbacks.add(
                        callback as unknown as ChatSegmentCompleteCallback<AiMsg>,
                    );
                    return;
                }

                if (event === 'error' && chatSegmentExceptionCallbacks) {
                    chatSegmentExceptionCallbacks.add(
                        callback as ChatSegmentErrorCallback,
                    );
                    return;
                }
            },
            removeListener: (event, callback) => {
                if (event === 'userMessageReceived') {
                    userMessageReceivedCallbacks?.delete(
                        callback as UserMessageReceivedCallback,
                    );
                    return;
                }

                if (event === 'aiMessageReceived') {
                    aiMessageReceivedCallbacks?.delete(
                        callback as AiMessageReceivedCallback<AiMsg>,
                    );
                    return;
                }

                if (event === 'aiMessageStreamStarted') {
                    aiMessageStreamStartedCallbacks?.delete(
                        callback as AiMessageStreamStartedCallback<AiMsg>,
                    );
                    return;
                }

                if (event === 'aiMessageStreamed') {
                    aiMessageStreamedCallbacks?.delete(
                        callback as AiMessageStreamedCallback<AiMsg>,
                    );
                    return;
                }

                if (event === 'aiChunkReceived') {
                    aiMessageChunkReceivedCallbacks?.delete(
                        callback as unknown as AiMessageChunkReceivedCallback<AiMsg>,
                    );
                    return;
                }

                if (event === 'complete') {
                    chatSegmentCompleteCallbacks?.delete(
                        callback as unknown as ChatSegmentCompleteCallback<AiMsg>,
                    );
                    return;
                }

                if (event === 'error') {
                    chatSegmentExceptionCallbacks?.delete(
                        callback as ChatSegmentErrorCallback,
                    );
                    return;
                }
            },
            destroy: () => removeAllListeners(),
        },
    };
};
