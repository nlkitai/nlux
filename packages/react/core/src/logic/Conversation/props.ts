import {ConversationOptions, HighlighterExtension} from '@nlux/core';
import {ReactElement} from 'react';
import {ChatSegment} from '../../../../../shared/src/types/chatSegment/chatSegment';
import {ResponseComponent} from '../../exports/messageOptions';
import {PersonaOptions} from '../../exports/personaOptions';

export type ConversationCompProps<AiMsg> = {
    segments: ChatSegment<AiMsg>[];
    conversationOptions?: ConversationOptions;
    personaOptions?: PersonaOptions;
    responseRenderer?: ResponseComponent<AiMsg>;
    syntaxHighlighter?: HighlighterExtension;
    openLinksInNewWindow?: boolean;
    loader?: ReactElement;
    onLastActiveSegmentChange?: (data: {
        uid: string;
        div: HTMLDivElement;
    } | undefined) => void;
};

export type ImperativeConversationCompProps = {
    streamChunk: (segmentId: string, messageId: string, chunk: string) => void;
    completeStream: (segmentId: string, messageId: string) => void;
};
