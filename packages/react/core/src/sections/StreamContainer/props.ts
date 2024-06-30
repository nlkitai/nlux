import {HighlighterExtension, SanitizerExtension} from '@nlux/core';
import {MessageDirection} from '@shared/components/Message/props';
import {PromptRenderer, ResponseRenderer} from '../../exports/messageOptions';
import {MarkdownContainersController} from '../../exports/hooks/usMarkdownContainers';

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
