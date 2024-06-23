import {ChatAdapter} from '../../types/adapters/chat/chatAdapter';
import {ChatAdapterExtras} from '../../types/adapters/chat/chatAdapterExtras';
import {isStandardChatAdapter, StandardChatAdapter} from '../../types/adapters/chat/standardChatAdapter';
import {ChatSegment} from '../../types/chatSegment/chatSegment';
import {AiBatchedMessage} from '../../types/chatSegment/chatSegmentAiMessage';
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

export const submitAndBatchTextResponse = async <AiMsg>(
    segmentId: string,
    userMessage: ChatSegmentUserMessage,
    adapter: ChatAdapter<AiMsg> | StandardChatAdapter<AiMsg>,
    extras: ChatAdapterExtras<AiMsg>,
    aiMessageReceivedCallbacks: Set<AiMessageReceivedCallback<AiMsg>>,
    chatSegmentCompleteCallbacks: Set<ChatSegmentCompleteCallback<AiMsg>>,
    chatSegmentExceptionCallbacks: Set<ChatSegmentErrorCallback>,
): Promise<void> => {
    try {
        const prompt = userMessage.content;

        const adapterAsStandardAdapter = isStandardChatAdapter(adapter)
            ? adapter as unknown as StandardChatAdapter<AiMsg>
            : undefined;

        const isStandardAdapter = adapterAsStandardAdapter !== undefined;


        const responseUid = uid();
        const participantRole = 'assistant';
        const status = 'complete';
        const time = new Date();
        const dataTransferMode = 'batch';

        let aiResponse: AiBatchedMessage<AiMsg> | undefined = undefined;
        if (isStandardAdapter) {
            const rawResponse = await adapterAsStandardAdapter.batchText!(prompt, extras);
            const preProcessedResponse = adapterAsStandardAdapter.preProcessAiBatchedMessage(rawResponse, extras);
            if (preProcessedResponse !== undefined && preProcessedResponse !== null) {
                aiResponse = {
                    uid: responseUid,
                    content: preProcessedResponse,
                    contentType: 'text',
                    serverResponse: rawResponse,
                    participantRole, status, time, dataTransferMode,
                };
            }
        } else {
            const response = await (adapter as ChatAdapter<AiMsg>).batchText!(prompt, extras);
            aiResponse = {
                uid: responseUid,
                content: response,
                contentType: 'text',
                serverResponse: undefined,
                participantRole, status, time, dataTransferMode,
            };
        }

        if (!aiResponse) {
            throw new Error('Response from adapter was undefined or cannot be processed');
        }

        //
        // We emit the AI message received event.
        //
        const validAiResponse = aiResponse as AiBatchedMessage<AiMsg> & {
            status: 'complete';
        };

        triggerAsyncCallback(() => {
            aiMessageReceivedCallbacks.forEach((callback) => {
                callback(validAiResponse);
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
};
