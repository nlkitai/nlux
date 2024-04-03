import {MessageDirection, MessageStatus} from '@nlux/core';
import {ReactElement, ReactNode} from 'react';

export type MessageProps = {
    direction: MessageDirection;
    status: MessageStatus;
    loader?: ReactElement;
    message?: ReactNode;
};
