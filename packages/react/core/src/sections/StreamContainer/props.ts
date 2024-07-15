import {HighlighterExtension, SanitizerExtension} from '@nlux/core';
import {MessageDirection} from '@shared/components/Message/props';
import {MarkdownContainersController} from '../../exports/hooks/usMarkdownContainers';
import {PromptRenderer, ResponseRenderer} from '../../exports/messageOptions';

export type StreamContainerProps<AisMsg> = {
    uid: string,
    direction: MessageDirection,
    status: 'streaming' | 'complete';
    initialMarkdownMessage?: string;
    responseRenderer?: ResponseRenderer<AisMsg>;
    promptRenderer?: PromptRenderer;
    markdownContainersController: MarkdownContainersController;
    markdownOptions?: {
        syntaxHighlighter?: HighlighterExtension;
        htmlSanitizer?: SanitizerExtension;
        markdownLinkTarget?: 'blank' | 'self';
        showCodeBlockCopyButton?: boolean;
        skipStreamingAnimation?: boolean;
        streamingAnimationSpeed?: number;
        waitTimeBeforeStreamCompletion?: number | 'never';
        onStreamComplete?: () => void;
    }
};

export type StreamContainerImperativeProps<AiMsg> = {
    streamChunk: (chunk: AiMsg) => void;
    completeStream: () => void;
    cancelStream: () => void;
};
