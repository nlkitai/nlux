import {
    AiMessageChunkReceivedCallback,
    AiMessageStreamedCallback,
    AiMessageStreamStartedCallback,
    ChatSegmentCompleteCallback,
    ChatSegmentExceptionCallback,
} from '../../../../../../../shared/src/types/chatSegment/chatSegmentEvents';
import {ChatAdapter} from '../../../../types/adapters/chat/chatAdapter';
import {ChatAdapterExtras} from '../../../../types/adapters/chat/chatAdapterExtras';

export const submitInStreamingMode = async <MessageType>(
    segmentId: string,
    prompt: string,
    adapter: ChatAdapter,
    extras: ChatAdapterExtras,
    aiMessageStreamStartedCallbacks: Set<AiMessageStreamStartedCallback>,
    aiMessageStreamedCallbacks: Set<AiMessageStreamedCallback>,
    aiMessageChunkReceivedCallbacks: Set<AiMessageChunkReceivedCallback>,
    chatSegmentCompleteCallbacks: Set<ChatSegmentCompleteCallback<MessageType>>,
    chatSegmentExceptionCallbacks: Set<ChatSegmentExceptionCallback>,
): Promise<void> => {
    // TODO
};
