import {ConversationOptions, HighlighterExtension} from '@nlux/core';
import {FunctionComponent, ReactElement} from 'react';
import {ChatSegment} from '../../../../../shared/src/types/chatSegment/chatSegment';
import {PersonaOptions} from '../../exports/personaOptions';

export type ConversationCompProps<AiMsg> = {
    segments: ChatSegment<AiMsg>[];
    conversationOptions?: ConversationOptions;
    personaOptions?: PersonaOptions;
    customRenderer?: FunctionComponent<{message: AiMsg}>;
    syntaxHighlighter?: HighlighterExtension;
    loader?: ReactElement;
};

export type ImperativeConversationCompProps = {
    scrollToBottom: () => void;
    streamChunk: (segmentId: string, messageId: string, chunk: string) => void;
};
