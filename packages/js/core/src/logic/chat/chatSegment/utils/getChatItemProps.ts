import {ChatSegmentItem} from '../../../../../../../shared/src/types/chatSegment/chatSegment';
import {ChatItemProps} from '../../../../../../../shared/src/ui/ChatItem/props';
import {
    participantNameFromRoleAndPersona
} from '../../../../../../../shared/src/utils/chat/participantNameFromRoleAndPersona';
import {conversationDefaultLayout} from '../../../../../../../shared/src/utils/dom/getConversationLayout';
import {stringifyRandomResponse} from '../../../../../../../shared/src/utils/stringifyRandomResponse';
import {ConversationLayout} from '../../../../exports/aiChat/options/conversationOptions';
import {UserPersona} from '../../../../exports/aiChat/options/personaOptions';

export const getChatItemPropsFromSegmentItem = <AiMsg>(
    segmentItem: ChatSegmentItem<AiMsg>,
    conversationLayout?: ConversationLayout,
    userPersona?: UserPersona,
    assistantPersona?: UserPersona,
): ChatItemProps | undefined => {
    const layout = conversationLayout ?? conversationDefaultLayout;
    if (segmentItem.participantRole === 'assistant') {
        const status = segmentItem.status === 'complete' ? 'complete' : 'streaming';

        if (segmentItem.dataTransferMode === 'stream') {
            return {
                status,
                layout,
                direction: 'incoming',
                name: participantNameFromRoleAndPersona('assistant', {assistant: assistantPersona}),
                picture: assistantPersona?.picture,
                // We do not provide am incoming message for streaming segments - As it's rendered by the chat item
                // while it's being streamed.
            };
        }

        if (segmentItem.status === 'complete') {
            return {
                status,
                layout,
                direction: 'incoming',
                name: participantNameFromRoleAndPersona('assistant', {assistant: assistantPersona}),
                picture: assistantPersona?.picture,
                message: stringifyRandomResponse<AiMsg>(segmentItem.content),
            };
        }

        return {
            status,
            layout,
            direction: 'incoming',
            name: participantNameFromRoleAndPersona('assistant', {assistant: assistantPersona}),
            picture: assistantPersona?.picture,
        };
    }

    return {
        status: 'complete',
        layout,
        direction: 'outgoing',
        message: segmentItem.content,
        name: participantNameFromRoleAndPersona('user', {user: userPersona}),
        picture: userPersona?.picture,
    } satisfies ChatItemProps;
};
