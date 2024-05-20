import {ChatSegmentItem} from '../../../../../../../shared/src/types/chatSegment/chatSegment';
import {ChatItemProps} from '../../../../../../../shared/src/ui/ChatItem/props';
import {conversationDefaultLayout} from '../../../../../../../shared/src/utils/dom/getConversationLayout';
import {stringifyRandomResponse} from '../../../../../../../shared/src/utils/stringifyRandomResponse';
import {ConversationLayout} from '../../../../exports/aiChat/options/conversationOptions';
import {UserPersona} from '../../../../exports/aiChat/options/personaOptions';

export const getChatItemPropsFromSegmentItem = <AiMsg>(
    segmentItem: ChatSegmentItem<AiMsg>,
    conversationLayout?: ConversationLayout,
    userPersona?: UserPersona,
    botPersona?: UserPersona,
): ChatItemProps | undefined => {
    const layout = conversationLayout ?? conversationDefaultLayout;
    if (segmentItem.participantRole === 'ai') {
        const status = segmentItem.status === 'complete' ? 'complete' : 'streaming';

        if (segmentItem.dataTransferMode === 'stream') {
            return {
                status,
                layout,
                direction: 'incoming',
                name: botPersona?.name,
                picture: botPersona?.picture,
                // We do not provide am incoming message for streaming segments - As it's rendered by the chat item
                // while it's being streamed.
            };
        }

        if (segmentItem.status === 'complete') {
            return {
                status,
                layout,
                direction: 'incoming',
                name: botPersona?.name,
                picture: botPersona?.picture,
                message: stringifyRandomResponse<AiMsg>(segmentItem.content),
            };
        }

        return {
            status,
            layout,
            direction: 'incoming',
            name: botPersona?.name,
            picture: botPersona?.picture,
        };
    }

    return {
        status: 'complete',
        layout,
        direction: 'outgoing',
        message: segmentItem.content,
        name: userPersona?.name,
        picture: userPersona?.picture,
    } satisfies ChatItemProps;
};
