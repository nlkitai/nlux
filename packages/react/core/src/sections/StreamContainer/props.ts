import {HighlighterExtension, SanitizerExtension} from '@nlux/core';
import {MessageDirection} from '@shared/components/Message/props';
import {BatchResponseRenderer, ResponseRenderer, StreamResponseRenderer} from '../../exports/messageOptions';

export type StreamContainerProps<AisMsg> = {
    uid: string,
    direction: MessageDirection,
    status: 'streaming' | 'complete';
    initialMarkdownMessage?: string;
    responseRenderer?: ResponseRenderer<AisMsg> | BatchResponseRenderer<AisMsg> | StreamResponseRenderer<AisMsg>;
    promptRenderer?: BatchResponseRenderer<AisMsg>;
    markdownOptions?: {
        syntaxHighlighter?: HighlighterExtension;
        htmlSanitizer?: SanitizerExtension;
        markdownLinkTarget?: 'blank' | 'self';
        showCodeBlockCopyButton?: boolean;
        skipStreamingAnimation?: boolean;
        streamingAnimationSpeed?: number;
    }
};

export type StreamContainerImperativeProps<AiMsg> = {
    streamChunk: (chunk: AiMsg) => void;
    completeStream: () => void;
};
