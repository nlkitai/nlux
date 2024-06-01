import {ChatSegmentItem} from '@shared/types/chatSegment/chatSegment';
import {ChatItemProps} from '@shared/components/ChatItem/props';
import {participantNameFromRoleAndPersona} from '@shared/utils/chat/participantNameFromRoleAndPersona';
import {conversationDefaultLayout} from '@shared/utils/dom/getConversationLayout';
import {stringifyRandomResponse} from '@shared/utils/stringifyRandomResponse';
import {ConversationLayout} from '../../../../aiChat/options/conversationOptions';
import {UserPersona} from '../../../../aiChat/options/personaOptions';

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
                direction: 'received',
                name: participantNameFromRoleAndPersona('assistant', {assistant: assistantPersona}),
                avatar: assistantPersona?.avatar,
                // We do not provide am received message for streaming segments - As it's rendered by the chat item
                // while it's being streamed.
            };
        }

        if (segmentItem.status === 'complete') {
            return {
                status,
                layout,
                direction: 'received',
                name: participantNameFromRoleAndPersona('assistant', {assistant: assistantPersona}),
                avatar: assistantPersona?.avatar,
                message: stringifyRandomResponse<AiMsg>(segmentItem.content),
            };
        }

        return {
            status,
            layout,
            direction: 'received',
            name: participantNameFromRoleAndPersona('assistant', {assistant: assistantPersona}),
            avatar: assistantPersona?.avatar,
        };
    }

    return {
        status: 'complete',
        layout,
        direction: 'sent',
        message: segmentItem.content,
        name: participantNameFromRoleAndPersona('user', {user: userPersona}),
        avatar: userPersona?.avatar,
    } satisfies ChatItemProps;
};
