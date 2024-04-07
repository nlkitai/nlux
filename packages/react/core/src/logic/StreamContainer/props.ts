import {MessageDirection} from '@nlux/core';

export type StreamContainerProps = {
    uid: string,
    direction: MessageDirection,
    status: 'rendered' | 'streaming' | 'error';
};

export type StreamContainerImperativeProps = {
    streamChunk: (chunk: string) => void;
};
