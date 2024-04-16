import {ChatSegment} from '../../../../../../../shared/src/types/chatSegment/chatSegment';
import {ChatSegmentAiMessage} from '../../../../../../../shared/src/types/chatSegment/chatSegmentAiMessage';
import {
    AiMessageReceivedCallback,
    ChatSegmentCompleteCallback,
    ChatSegmentExceptionCallback,
} from '../../../../../../../shared/src/types/chatSegment/chatSegmentEvents';
import {ChatSegmentUserMessage} from '../../../../../../../shared/src/types/chatSegment/chatSegmentUserMessage';
import {uid} from '../../../../../../../shared/src/utils/uid';
import {warn} from '../../../../../../../shared/src/utils/warn';
import {ChatAdapter} from '../../../../types/adapters/chat/chatAdapter';
import {ChatAdapterExtras} from '../../../../types/adapters/chat/chatAdapterExtras';
import {triggerAsyncCallback} from './utils/triggerAsyncCallback';

export const submitInFetchMode = async <AiMsg>(
    segmentId: string,
    userMessage: ChatSegmentUserMessage,
    adapter: ChatAdapter<AiMsg>,
    extras: ChatAdapterExtras<AiMsg>,
    aiMessageReceivedCallbacks: Set<AiMessageReceivedCallback<AiMsg>>,
    chatSegmentCompleteCallbacks: Set<ChatSegmentCompleteCallback<AiMsg>>,
    chatSegmentExceptionCallbacks: Set<ChatSegmentExceptionCallback>,
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
        const errorMessage = 'An error occurred while fetching the response';
        warn(error);

        triggerAsyncCallback(() => {
            chatSegmentExceptionCallbacks.forEach((callback) => {
                callback({
                    type: 'error',
                    id: 'NX-AD-001',
                    message: errorMessage,
                });
            });
        });
    }
};
