import {MessageDirection, MessageStatus} from '../Message/props';

export type ChatItemProps = {
    direction: MessageDirection;
    status: MessageStatus;
    loader?: HTMLElement;
    message?: string;

    name?: string;
    picture?: string | HTMLElement;
};
