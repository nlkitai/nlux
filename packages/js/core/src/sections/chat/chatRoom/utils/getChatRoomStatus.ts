import {ChatItem} from '@shared/types/conversation';

export const getChatRoomStatus = <AiMsg = string>(
    initialConversationContent: ChatItem<AiMsg>[] | undefined,
    segmentsCount?: number,
): 'starting' | 'active' => {
    if (initialConversationContent !== undefined && initialConversationContent.length > 0) {
        return 'active';
    }

    if (segmentsCount !== undefined && segmentsCount > 0) {
        return 'active';
    }

    return 'starting';
};
