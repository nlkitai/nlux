import {ChatSegmentItem} from '../../../../../../../shared/src/types/chatSegment/chatSegment';
import {ChatItemProps} from '../../../../../../../shared/src/ui/ChatItem/props';
import {stringifyRandomResponse} from '../../../../../../../shared/src/utils/stringifyRandomResponse';

export const getChatItemPropsFromSegmentItem = <AiMsg>(segmentItem: ChatSegmentItem<AiMsg>): ChatItemProps | undefined => {
    if (segmentItem.participantRole === 'ai') {
        const status = segmentItem.status === 'complete' ? 'complete' : 'streaming';

        if (segmentItem.dataTransferMode === 'stream') {
            return {
                status,
                direction: 'incoming',
                // We do not provide am incoming message for streaming segments - As it's rendered by the chat item
                // while it's being streamed.
            };
        }

        if (segmentItem.status === 'complete') {
            return {
                status,
                direction: 'incoming',
                message: stringifyRandomResponse(segmentItem.content),
            };
        }

        return {
            status,
            direction: 'incoming',
        };
    }

    return {
        status: 'complete',
        direction: 'outgoing',
        message: segmentItem.content,
    } satisfies ChatItemProps;
};
