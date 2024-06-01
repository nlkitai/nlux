import {ConversationLayout, HighlighterExtension, SanitizerExtension} from '@nlux/core';
import {ReactElement, RefObject} from 'react';
import {ChatSegment} from '@shared/types/chatSegment/chatSegment';
import {PromptRenderer, ResponseRenderer} from '../../exports/messageOptions';
import {PersonaOptions} from '../../exports/personaOptions';

export type ChatSegmentProps<AiMsg> = {
    chatSegment: ChatSegment<AiMsg>
    responseRenderer?: ResponseRenderer<AiMsg>;
    promptRenderer?: PromptRenderer;
    loader?: ReactElement;
    personaOptions?: PersonaOptions;
    layout: ConversationLayout;
    syntaxHighlighter?: HighlighterExtension;
    htmlSanitizer?: SanitizerExtension;
    markdownLinkTarget?: 'blank' | 'self';
    showCodeBlockCopyButton?: boolean;
    skipStreamingAnimation?: boolean;
    streamingAnimationSpeed?: number;
    containerRef?: RefObject<HTMLDivElement>;
};

export type ChatSegmentImperativeProps<AiMsg> = {
    streamChunk: (messageId: string, chunk: AiMsg) => void;
    completeStream: (messageId: string) => void;
};
