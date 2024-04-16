import {
    AiMessageReceivedCallback,
    ChatSegmentCompleteCallback,
    ChatSegmentExceptionCallback,
} from '../../../../../../../shared/src/types/chatSegment/chatSegmentEvents';
import {ChatAdapter} from '../../../../types/adapters/chat/chatAdapter';
import {ChatAdapterExtras} from '../../../../types/adapters/chat/chatAdapterExtras';

export const submitInFetchMode = async <MessageType>(
    segmentId: string,
    prompt: string,
    adapter: ChatAdapter,
    extras: ChatAdapterExtras,
    aiMessageReceivedCallbacks: Set<AiMessageReceivedCallback<MessageType>>,
    chatSegmentCompleteCallbacks: Set<ChatSegmentCompleteCallback<MessageType>>,
    chatSegmentExceptionCallbacks: Set<ChatSegmentExceptionCallback>,
): Promise<void> => {
    // TODO
};
