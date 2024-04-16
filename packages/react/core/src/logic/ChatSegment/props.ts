import {HighlighterExtension} from '@nlux/core';
import {FunctionComponent, ReactElement} from 'react';
import {ChatSegment} from '../../../../../shared/src/types/chatSegment/chatSegment';
import {PersonaOptions} from '../../exports/personaOptions';

export type ChatSegmentProps<MessageType> = {
    chatSegment: ChatSegment<MessageType>
    customRenderer?: FunctionComponent<{message: MessageType}>;
    loader?: ReactElement;
    personaOptions?: PersonaOptions;
    syntaxHighlighter?: HighlighterExtension;
};

export type ChatSegmentImperativeProps<MessageType> = {
    streamChunk: (messageId: string, chunk: string) => void;
};
