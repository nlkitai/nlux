import {MessageDirection} from '@nlux/core';
import {ReactElement, ReactNode} from 'react';

export type ChatItemProps<MessageType> = {
    uid: string;
    direction: MessageDirection;
    status: 'rendered' | 'streaming' | 'loading' | 'error';
    loader?: ReactElement;
    message?: MessageType | string;
    customRenderer?: (message: MessageType) => ReactNode;
    name?: string;
    picture?: string | ReactElement;
};

export type ChatItemImperativeProps = {
    streamChunk: (chunk: string) => void;
};
