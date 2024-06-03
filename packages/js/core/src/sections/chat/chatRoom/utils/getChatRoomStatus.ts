import {ChatItem} from '@shared/types/conversation';

export const getChatRoomStatus = (
    initialConversationContent: ChatItem<AiMsg>[] | undefined,
    segmentsCount: number | undefined,
): 'starting' | 'active' => {
    if (initialConversationContent !== undefined && initialConversationContent.length > 0) {
        return 'active';
    }

    if (segmentsCount !== undefined && segmentsCount > 0) {
        return 'active';
    }

    return 'starting';
};
