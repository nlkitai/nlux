import {ChatSegment, ChatSegmentItem} from '../../types/chatSegment/chatSegment';
import {ChatSegmentAiMessage} from '../../types/chatSegment/chatSegmentAiMessage';
import {ChatSegmentUserMessage} from '../../types/chatSegment/chatSegmentUserMessage';
import {ChatItem} from '../../types/conversation';
import {uid} from '../uid';
import {warn} from '../warn';

export const chatItemsToChatSegment = <AiMsg>(
    chatItems: ChatItem<AiMsg>[],
): ChatSegment<AiMsg> => {
    const segmentItems: ChatSegmentItem<AiMsg>[] = chatItems.map((message, index) => {
        if (message.role !== 'assistant' && message.role !== 'user') {
            warn(
                `Invalid role for item at index ${index} in initial conversation: ` +
                `Role must be "assistant" or "user"`,
            );

            return;
        }

        if (message.role === 'user') {
            if (typeof message.message !== 'string') {
                warn(
                    `Invalid message type for item at index ${index} in initial conversation: ` +
                    `When role is "user", message must be a string`,
                );

                return;
            }

            return {
                uid: uid(),
                time: new Date(),
                status: 'complete',
                participantRole: 'user',
                content: message.message,
                contentType: 'text',
            } satisfies ChatSegmentUserMessage;
        }

        return {
            uid: uid(),
            time: new Date(),
            status: 'complete',
            participantRole: 'assistant',
            content: message.message,
            contentType: 'text',
            serverResponse: message.serverResponse,
            dataTransferMode: 'batch',
        } satisfies ChatSegmentAiMessage<AiMsg>;
    }).filter(
        (segmentItem: ChatSegmentItem<AiMsg> | undefined): segmentItem is ChatSegmentItem<AiMsg> => {
            return segmentItem !== undefined;
        },
    ) as ChatSegmentItem<AiMsg>[];

    return {
        uid: 'initial',
        status: 'complete',
        items: segmentItems,
    } satisfies ChatSegment<AiMsg>;
};
