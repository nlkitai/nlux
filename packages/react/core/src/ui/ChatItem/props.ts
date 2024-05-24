import {ConversationLayout, DataTransferMode, HighlighterExtension, SanitizerExtension} from '@nlux/core';
import {ReactElement} from 'react';
import {MessageDirection} from '../../../../../shared/src/ui/Message/props';
import {PromptRenderer, ResponseRenderer} from '../../exports/messageOptions';

export type ChatItemProps<AiMsg> = {
    uid: string;
    direction: MessageDirection;
    layout: ConversationLayout;
    dataTransferMode: DataTransferMode;
    status: 'streaming' | 'complete';
    fetchedContent?: AiMsg;
    fetchedServerResponse?: unknown;
    streamedContent?: AiMsg[];
    streamedServerResponse?: Array<unknown>;
    responseRenderer?: ResponseRenderer<AiMsg>;
    promptRenderer?: PromptRenderer;
    name: string;
    picture?: string | ReactElement;
    syntaxHighlighter?: HighlighterExtension;
    htmlSanitizer?: SanitizerExtension;
    markdownLinkTarget?: 'blank' | 'self';
    showCodeBlockCopyButton?: boolean;
    skipStreamingAnimation?: boolean;
    streamingAnimationSpeed?: number;
};

export type ChatItemImperativeProps<AiMsg> = {
    streamChunk: (chunk: AiMsg) => void;
    completeStream: () => void;
};
