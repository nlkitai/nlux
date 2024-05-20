import {MessageDirection, MessageStatus} from '../Message/props';

export type ChatItemLayout = 'bubbles' | 'list';

export type ChatItemProps = {
    direction: MessageDirection;
    status: MessageStatus;
    layout: ChatItemLayout;
    message?: string;

    name?: string;
    picture?: string | HTMLElement;
};
