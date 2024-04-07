import {MessageDirection} from '@nlux/core';
import {ReactElement, ReactNode} from 'react';

export type MessageProps = {
    uid: string;
    direction: MessageDirection;
    status: 'rendered' | 'streaming' | 'loading' | 'error';
    loader?: ReactElement;
    message?: ReactNode;
};
