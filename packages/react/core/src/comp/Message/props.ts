import {MessageDirection, MessageStatus} from '@nlux/core';
import {ReactElement, ReactNode} from 'react';

export type MessageProps = {
    id: string;
    direction: MessageDirection;
    status: 'rendered' | 'streaming' | 'loading' | 'error';
    loader?: ReactElement;
    message?: ReactNode;
};
