import {MessageDirection, MessageStatus} from '../Message/props';

export type ConversationItemProps = {
    direction: MessageDirection;
    status: MessageStatus;
    loader?: HTMLElement;
    message?: string;

    name?: string;
    picture?: string | HTMLElement;
};
