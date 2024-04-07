import {ConversationMessage} from '@nlux-dev/react/src/comp/Conversation/props';
import {ChatSegment, ChatSegmentItem} from '../../types/chatSegment';
import {warn} from '../warn';

export const getMessageStatusFromPart = <MessageType>(
    part: ChatSegment<MessageType>,
    item: ChatSegmentItem<MessageType>,
): ConversationMessage<MessageType>['status'] => {
    if (part.status === 'error') {
        return 'error';
    }

    if (part.status === 'complete') {
        return 'rendered';
    }

    if (item.participantRole === 'user') {
        return 'rendered';
    }

    if (item.status === 'streaming') {
        return 'streaming';
    }

    if (item.status === 'complete') {
        if (item.dataTransferMode === 'stream') {
            return 'rendered';
        }

        if (item.content === undefined) {
            warn('Message content is undefined');
            return 'error';
        }

        return 'rendered';
    }

    if (item.status === 'error') {
        return 'error';
    }

    return 'loading';
};
