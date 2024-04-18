import {ChatSegmentItem} from '../../../../../../../shared/src/types/chatSegment/chatSegment';
import {ChatItemProps} from '../../../../../../../shared/src/ui/ChatItem/props';
import {stringifyRandomResponse} from '../../../../../../../shared/src/utils/stringifyRandomResponse';

export const getChatItemPropsFromSegmentItem = <AiMsg>(segmentItem: ChatSegmentItem<AiMsg>): ChatItemProps | undefined => {
    if (segmentItem.participantRole === 'ai') {
        const status = segmentItem.status === 'complete' ? 'rendered' : (
            segmentItem.status === 'streaming' ? 'streaming' : 'error'
        );

        if (segmentItem.dataTransferMode === 'stream') {
            return {status, direction: 'incoming'};
        }

        if (segmentItem.status === 'complete') {
            return {
                status,
                direction: 'incoming',
                message: stringifyRandomResponse(segmentItem.content),
            };
        }

        if (segmentItem.status === 'loading') {
            return {status, direction: 'incoming'};
        }

        if (segmentItem.status === 'error') {
            return {status, direction: 'incoming'};
        }

        return;
    }

    return {
        status: 'rendered',
        direction: 'outgoing',
        message: segmentItem.content,
    } satisfies ChatItemProps;
};
