import {
    AiMessageChunkReceivedCallback,
    AiMessageReceivedCallback,
    AiMessageStreamedCallback,
    AiMessageStreamStartedCallback,
    ChatSegmentCompleteCallback,
    ChatSegmentExceptionCallback,
    UserMessageReceivedCallback,
} from '../../../../../../../shared/src/types/chatSegment/chatSegmentEvents';
import {uid} from '../../../../../../../shared/src/utils/uid';
import {ChatAdapter} from '../../../../types/adapters/chat/chatAdapter';
import {ChatAdapterExtras} from '../../../../types/adapters/chat/chatAdapterExtras';
import {submitInFetchMode} from './submitInFetchMode';
import {submitInStreamingMode} from './submitInStreamingMode';
import {SubmitPrompt} from './submitPrompt';
import {getDataTransferModeToUse} from './utils/dataTransferModeToUse';
import {createEmptyCompleteSegment} from './utils/emptyCompleteSegment';
import {createEmptyErrorSegment} from './utils/emptyErrorSegment';
import {getUserMessageFromPrompt} from './utils/userMessageFromPrompt';

export const submitPrompt: SubmitPrompt = <MessageType>(
    prompt: string,
    adapter: ChatAdapter<MessageType>,
    extras: ChatAdapterExtras<MessageType>,
) => {
    //
    // We check if the prompt is empty and that the adapter supports at least one data transfer mode.
    //
    if (!prompt) {
        return createEmptyCompleteSegment<MessageType>();
    }

    if (adapter.streamText === undefined && adapter.fetchText === undefined) {
        return createEmptyErrorSegment<MessageType>('The adapter does not support any data transfer modes');
    }

    //
    // We know that we will attempt to submit the prompt to the adapter.
    // We create data structure for event listeners.
    //
    const segmentId = uid();

    // (a.i). USER MESSAGE RECEIVED + (a.ii) CHAT SEGMENT COMPLETE + (a.iii) CHAT SEGMENT EXCEPTION
    let userMessageReceivedCallbacks: Set<UserMessageReceivedCallback> | undefined = new Set();
    let chatSegmentCompleteCallbacks: Set<ChatSegmentCompleteCallback<MessageType>> | undefined = new Set();
    let chatSegmentExceptionCallbacks: Set<ChatSegmentExceptionCallback> | undefined = new Set();

    // (b). AI MESSAGE RECEIVED
    let aiMessageReceivedCallbacks: Set<AiMessageReceivedCallback<MessageType>> | undefined = undefined;

    // (c). AI MESSAGE STREAMED ( 3 events )
    let aiMessageStreamStartedCallbacks: Set<AiMessageStreamStartedCallback> | undefined = undefined;
    let aiMessageStreamedCallbacks: Set<AiMessageStreamedCallback> | undefined = undefined;
    let aiMessageChunkReceivedCallbacks: Set<AiMessageChunkReceivedCallback> | undefined = undefined;

    //
    // We start by emitting a user message.
    //
    setTimeout(() => {
        if (!userMessageReceivedCallbacks?.size) {
            return;
        }

        const userMessage = getUserMessageFromPrompt(prompt);
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
    }, 0);

    const dataTransferModeToUse = getDataTransferModeToUse(adapter);

    if (dataTransferModeToUse === 'fetch') {
        // (b). AI MESSAGE RECEIVED — Only needed in fetch mode.
        aiMessageReceivedCallbacks = new Set();

        submitInFetchMode(
            segmentId,
            prompt,
            adapter,
            extras,
            aiMessageReceivedCallbacks,
            chatSegmentCompleteCallbacks,
            chatSegmentExceptionCallbacks,
        ).finally(() => {
            // Finally -> Final status of the segment.
            // No more items will be added to the segment after this point.
            // No more events will be emitted after this point.
            removeAllListeners();
        });
    } else {
        // (c). AI MESSAGE STREAMED ( 3 events ) — Only needed in streaming mode.
        aiMessageStreamStartedCallbacks = new Set();
        aiMessageStreamedCallbacks = new Set();
        aiMessageChunkReceivedCallbacks = new Set();

        submitInStreamingMode(
            segmentId,
            prompt,
            adapter,
            extras,
            aiMessageStreamStartedCallbacks,
            aiMessageStreamedCallbacks,
            aiMessageChunkReceivedCallbacks,
            chatSegmentCompleteCallbacks,
            chatSegmentExceptionCallbacks,
        ).finally(() => {
            // Finally -> Final status of the segment.
            // No more items will be added to the segment after this point.
            // No more events will be emitted after this point.
            removeAllListeners();
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
                        callback as AiMessageReceivedCallback<MessageType>,
                    );
                    return;
                }

                if (event === 'aiMessageStreamStarted' && aiMessageStreamStartedCallbacks) {
                    aiMessageStreamStartedCallbacks.add(
                        callback as AiMessageStreamStartedCallback,
                    );
                    return;
                }

                if (event === 'aiMessageStreamed' && aiMessageStreamedCallbacks) {
                    aiMessageStreamedCallbacks.add(
                        callback as AiMessageStreamedCallback,
                    );
                    return;
                }

                if (event === 'aiChunkReceived' && aiMessageChunkReceivedCallbacks) {
                    aiMessageChunkReceivedCallbacks.add(
                        callback as AiMessageChunkReceivedCallback,
                    );
                    return;
                }

                if (event === 'complete' && chatSegmentCompleteCallbacks) {
                    chatSegmentCompleteCallbacks.add(
                        callback as unknown as ChatSegmentCompleteCallback<MessageType>,
                    );
                    return;
                }

                if (event === 'exception' && chatSegmentExceptionCallbacks) {
                    chatSegmentExceptionCallbacks.add(
                        callback as ChatSegmentExceptionCallback,
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
                        callback as AiMessageReceivedCallback<MessageType>,
                    );
                    return;
                }

                if (event === 'aiMessageStreamStarted') {
                    aiMessageStreamStartedCallbacks?.delete(
                        callback as AiMessageStreamStartedCallback,
                    );
                    return;
                }

                if (event === 'aiMessageStreamed') {
                    aiMessageStreamedCallbacks?.delete(
                        callback as AiMessageStreamedCallback,
                    );
                    return;
                }

                if (event === 'aiChunkReceived') {
                    aiMessageChunkReceivedCallbacks?.delete(
                        callback as AiMessageChunkReceivedCallback,
                    );
                    return;
                }

                if (event === 'complete') {
                    chatSegmentCompleteCallbacks?.delete(
                        callback as unknown as ChatSegmentCompleteCallback<MessageType>,
                    );
                    return;
                }

                if (event === 'exception') {
                    chatSegmentExceptionCallbacks?.delete(
                        callback as ChatSegmentExceptionCallback,
                    );
                    return;
                }
            },
            destroy: () => {
                removeAllListeners();
            },
        },
    };
};
