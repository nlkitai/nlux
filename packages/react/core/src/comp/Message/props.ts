import {MessageDirection, MessageStatus} from '@nlux-dev/core/src/comp/Message/props';
import {ReactElement, ReactNode} from 'react';

export type MessageProps = {
    direction: MessageDirection;
    status: MessageStatus;
    loader?: ReactElement;
    message?: ReactNode;
};
