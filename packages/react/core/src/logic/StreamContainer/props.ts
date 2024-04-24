import {HighlighterExtension} from '@nlux/core';
import {MessageDirection} from '../../../../../shared/src/ui/Message/props';

export type StreamContainerProps = {
    uid: string,
    direction: MessageDirection,
    status: 'rendered' | 'streaming' | 'error';
    initialMarkdownMessage?: string;
    markdownOptions?: {
        syntaxHighlighter?: HighlighterExtension;
        openLinksInNewWindow?: boolean;
    }
};

export type StreamContainerImperativeProps = {
    streamChunk: (chunk: string) => void;
    completeStream: () => void;
};
