import {ChatSegment, HighlighterExtension} from '@nlux/core';
import {ReactElement, ReactNode} from 'react';
import {PersonaOptions} from '../../exp/personaOptions';

export type ChatSegmentProps<MessageType> = {
    chatSegment: ChatSegment<MessageType>
    customRenderer?: <MessageType>(message: MessageType) => ReactNode;
    loader?: ReactElement;
    personaOptions?: PersonaOptions;
    syntaxHighlighter?: HighlighterExtension;
};

export type ChatSegmentImperativeProps<MessageType> = {
    streamChunk: (messageId: string, chunk: string) => void;
};
