import {HighlighterExtension} from '@nlux/core';
import {MessageDirection} from '../../../../../shared/src/ui/Message/props';
import {ResponseComponent} from '../../exports/messageOptions';

export type StreamContainerProps<AisMsg> = {
    uid: string,
    direction: MessageDirection,
    status: 'streaming' | 'complete';
    initialMarkdownMessage?: string;
    responseRenderer?: ResponseComponent<AisMsg>;
    markdownOptions?: {
        syntaxHighlighter?: HighlighterExtension;
        openLinksInNewWindow?: boolean;
    }
};

export type StreamContainerImperativeProps = {
    streamChunk: (chunk: string) => void;
    completeStream: () => void;
};
