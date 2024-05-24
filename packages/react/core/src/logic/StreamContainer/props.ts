import {HighlighterExtension, SanitizerExtension} from '@nlux/core';
import {MessageDirection} from '../../../../../shared/src/ui/Message/props';
import {ResponseRenderer} from '../../exports/messageOptions';

export type StreamContainerProps<AisMsg> = {
    uid: string,
    direction: MessageDirection,
    status: 'streaming' | 'complete';
    initialMarkdownMessage?: string;
    responseRenderer?: ResponseRenderer<AisMsg>;
    promptRenderer?: ResponseRenderer<AisMsg>;
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
