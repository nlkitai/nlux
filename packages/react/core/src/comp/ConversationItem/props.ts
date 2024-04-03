import {MessageDirection, MessageStatus} from '@nlux/core';
import {ReactElement, ReactNode} from 'react';

export type ConversationItemProps<MessageType> = {
    direction: MessageDirection;
    status: MessageStatus;
    loader?: ReactElement;
    message?: MessageType | string;
    customRenderer?: (message: MessageType) => ReactNode;
    name?: string;
    picture?: string | ReactElement;
};
