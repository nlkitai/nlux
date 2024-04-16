import {
    AiMessageReceivedCallback,
    ChatSegmentCompleteCallback,
    ChatSegmentExceptionCallback,
} from '../../../../../../../shared/src/types/chatSegment/chatSegmentEvents';
import {warn} from '../../../../../../../shared/src/utils/warn';
import {ChatAdapter} from '../../../../types/adapters/chat/chatAdapter';
import {ChatAdapterExtras} from '../../../../types/adapters/chat/chatAdapterExtras';

export const submitInFetchMode = async <MessageType>(
    segmentId: string,
    prompt: string,
    adapter: ChatAdapter<MessageType>,
    extras: ChatAdapterExtras<MessageType>,
    aiMessageReceivedCallbacks: Set<AiMessageReceivedCallback<MessageType>>,
    chatSegmentCompleteCallbacks: Set<ChatSegmentCompleteCallback<MessageType>>,
    chatSegmentExceptionCallbacks: Set<ChatSegmentExceptionCallback>,
): Promise<void> => {
    try {
        const response = await adapter.fetchText!(prompt, extras);
    } catch (error) {
        const errorMessage = 'An error occurred while fetching the response';
        warn(error);

        chatSegmentExceptionCallbacks.forEach((callback) => {
            callback({
                type: 'error',
                message: errorMessage,
            });
        });
    }
};
