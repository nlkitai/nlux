import {MessageDirection} from '@nlux/core';
import {FunctionComponent, ReactElement} from 'react';

export type ChatItemProps<MessageType> = {
    uid: string;
    direction: MessageDirection;
    status: 'rendered' | 'streaming' | 'loading' | 'error';
    loader?: ReactElement;
    message?: MessageType | string;
    customRenderer?: FunctionComponent<{message: MessageType}>;
    name?: string;
    picture?: string | ReactElement;
};

export type ChatItemImperativeProps = {
    streamChunk: (chunk: string) => void;
};
