import {ConversationLayout} from '../../../../js/core/src/exports/aiChat/options/conversationOptions';
import {MessageDirection, MessageStatus} from '../Message/props';

export type ChatItemProps = {
    direction: MessageDirection;
    status: MessageStatus;
    layout: ConversationLayout;
    message?: string;

    name?: string;
    picture?: string | HTMLElement;
};
