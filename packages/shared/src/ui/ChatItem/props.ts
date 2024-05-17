import {ConversationDisplayMode} from '../../../../js/core/src/exports/aiChat/options/conversationOptions';
import {MessageDirection, MessageStatus} from '../Message/props';

export type ChatItemProps = {
    direction: MessageDirection;
    status: MessageStatus;
    displayMode: ConversationDisplayMode;
    message?: string;

    name?: string;
    picture?: string | HTMLElement;
};
