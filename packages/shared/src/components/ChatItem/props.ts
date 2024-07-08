import {MessageDirection, MessageStatus} from '../Message/props';

export type ChatItemLayout = 'bubbles' | 'list';

export type ChatItemProps = {
    direction: MessageDirection;
    status: MessageStatus;
    layout: ChatItemLayout;
    name: string; // The name is required, as it should be displayed in list layout. Default can be AI or User.

    message?: string;
    avatar?: string | HTMLElement;
    htmlSanitizer?: (html: string) => string;
};
