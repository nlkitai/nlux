import {ChatSegmentItem} from '../../../../../../../shared/src/types/chatSegment/chatSegment';
import {ChatItemProps} from '../../../../../../../shared/src/ui/ChatItem/props';
import {stringifyRandomResponse} from '../../../../../../../shared/src/utils/stringifyRandomResponse';
import {ConversationLayout} from '../../../../exports/aiChat/options/conversationOptions';
import {UserPersona} from '../../../../exports/aiChat/options/personaOptions';

export const getChatItemPropsFromSegmentItem = <AiMsg>(
    segmentItem: ChatSegmentItem<AiMsg>,
    conversationLayout: ConversationLayout,
    userPersona?: UserPersona,
    botPersona?: UserPersona,
): ChatItemProps | undefined => {
    if (segmentItem.participantRole === 'ai') {
        const status = segmentItem.status === 'complete' ? 'complete' : 'streaming';

        if (segmentItem.dataTransferMode === 'stream') {
            return {
                status,
                direction: 'incoming',
                layout: conversationLayout,
                name: botPersona?.name,
                picture: botPersona?.picture,
                // We do not provide am incoming message for streaming segments - As it's rendered by the chat item
                // while it's being streamed.
            };
        }

        if (segmentItem.status === 'complete') {
            return {
                status,
                direction: 'incoming',
                layout: conversationLayout,
                name: botPersona?.name,
                picture: botPersona?.picture,
                message: stringifyRandomResponse<AiMsg>(segmentItem.content),
            };
        }

        return {
            status,
            direction: 'incoming',
            layout: conversationLayout,
            name: botPersona?.name,
            picture: botPersona?.picture,
        };
    }

    return {
        status: 'complete',
        direction: 'outgoing',
        layout: conversationLayout,
        message: segmentItem.content,
        name: userPersona?.name,
        picture: userPersona?.picture,
    } satisfies ChatItemProps;
};
