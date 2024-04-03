import {MessageDirection, MessageStatus} from '@nlux-dev/core/src/comp/Message/props';
import {ReactElement, ReactNode} from 'react';

export type CustomConversationItemProps<MessageType> = {
    direction: MessageDirection;
    status: MessageStatus;
    loader?: ReactElement;
    message?: MessageType | string;
    customRender?: (message: MessageType) => ReactNode;

    name?: string;
    picture?: string | ReactElement;
};
