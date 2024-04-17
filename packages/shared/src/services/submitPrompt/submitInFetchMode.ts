import {ChatAdapter} from '../../types/adapters/chat/chatAdapter';
import {ChatAdapterExtras} from '../../types/adapters/chat/chatAdapterExtras';
import {ChatSegment} from '../../types/chatSegment/chatSegment';
import {ChatSegmentAiMessage} from '../../types/chatSegment/chatSegmentAiMessage';
import {
    AiMessageReceivedCallback,
    ChatSegmentCompleteCallback,
    ChatSegmentErrorCallback,
} from '../../types/chatSegment/chatSegmentEvents';
import {ChatSegmentUserMessage} from '../../types/chatSegment/chatSegmentUserMessage';
import {NLErrorId} from '../../types/exceptions/errors';
import {uid} from '../../utils/uid';
import {warn} from '../../utils/warn';
import {triggerAsyncCallback} from './utils/triggerAsyncCallback';

export const submitInFetchMode = async <AiMsg>(
    segmentId: string,
    userMessage: ChatSegmentUserMessage,
    adapter: ChatAdapter<AiMsg>,
    extras: ChatAdapterExtras<AiMsg>,
    aiMessageReceivedCallbacks: Set<AiMessageReceivedCallback<AiMsg>>,
    chatSegmentCompleteCallbacks: Set<ChatSegmentCompleteCallback<AiMsg>>,
    chatSegmentExceptionCallbacks: Set<ChatSegmentErrorCallback>,
): Promise<void> => {
    try {
        const prompt = userMessage.content;
        const response: AiMsg = await adapter.fetchText!(prompt, extras);
        const aiResponse: ChatSegmentAiMessage<AiMsg> = {
            uid: uid(),
            participantRole: 'ai',
            status: 'complete',
            time: new Date(),
            content: response,
            dataTransferMode: 'fetch',
        };

        //
        // We emit the AI message received event.
        //
        triggerAsyncCallback(() => {
            aiMessageReceivedCallbacks.forEach((callback) => {
                callback(aiResponse);
            });
        });

        //
        // We emit the chat segment complete event.
        //
        const updatedChatSegment: ChatSegment<AiMsg> = {
            uid: segmentId,
            status: 'complete',
            items: [
                userMessage,
                aiResponse,
            ],
        };

        triggerAsyncCallback(() => {
            chatSegmentCompleteCallbacks.forEach((callback) => {
                callback(updatedChatSegment);
            });
        });
    } catch (error) {
        warn(error);

        triggerAsyncCallback(() => {
            const errorId: NLErrorId = 'failed-to-load-content';
            chatSegmentExceptionCallbacks
                .forEach((callback) => callback(errorId));
        });
    }
};
