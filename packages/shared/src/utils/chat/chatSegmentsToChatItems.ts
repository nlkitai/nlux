import {ChatSegment} from '../../types/chatSegment/chatSegment';
import {ChatItem} from '../../types/conversation';

export const chatSegmentsToChatItems = <AiMsg>(
    chatSegments: ChatSegment<AiMsg>[],
): ChatItem<AiMsg>[] => {
    const chatItems: ChatItem<AiMsg>[] = [];
    chatSegments.forEach((segment) => {
        segment.items.forEach((item) => {
            if (item.status !== 'complete') {
                return;
            }

            if (item.participantRole === 'assistant') {
                chatItems.push({
                    role: 'assistant',
                    message: item.content as AiMsg,
                });
            } else {
                if (item.participantRole === 'user') {
                    return chatItems.push({
                        role: 'user',
                        message: item.content,
                    });
                }
            }
        });
    });

    return chatItems;
};
