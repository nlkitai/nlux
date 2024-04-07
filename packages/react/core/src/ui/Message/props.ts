import {MessageDirection} from '@nlux/core';
import {FC, ReactElement, ReactNode} from 'react';

export type MessageProps<MessageType> = {
    uid: string;
    direction: MessageDirection;
    status: 'rendered' | 'streaming' | 'loading' | 'error';
    loader?: ReactElement;
    message?: ReactNode | FC<{message: MessageType}>;
};
