import {ConversationLayout, HighlighterExtension} from '@nlux/core';
import {ReactElement, RefObject} from 'react';
import {ChatSegment} from '../../../../../shared/src/types/chatSegment/chatSegment';
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
