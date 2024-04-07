import {ChatSegment, ConversationOptions, HighlighterExtension} from '@nlux/core';
import {FunctionComponent, ReactElement} from 'react';
import {PersonaOptions} from '../../exports/personaOptions';

export type ConversationCompProps<MessageType> = {
    segments: ChatSegment<MessageType>[];
    conversationOptions?: ConversationOptions;
    personaOptions?: PersonaOptions;
    customRenderer?: FunctionComponent<{message: MessageType}>;
    syntaxHighlighter?: HighlighterExtension;
    loader?: ReactElement;
};

export type ImperativeConversationCompProps = {
    scrollToBottom: () => void;
    streamChunk: (segmentId: string, messageId: string, chunk: string) => void;
};
