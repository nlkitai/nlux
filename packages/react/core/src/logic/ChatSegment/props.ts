import {HighlighterExtension} from '@nlux/core';
import {FunctionComponent, ReactElement, RefObject} from 'react';
import {ChatSegment} from '../../../../../shared/src/types/chatSegment/chatSegment';
import {PersonaOptions} from '../../exports/personaOptions';

export type ChatSegmentProps<AiMsg> = {
    chatSegment: ChatSegment<AiMsg>
    customRenderer?: FunctionComponent<{message: AiMsg}>;
    loader?: ReactElement;
    personaOptions?: PersonaOptions;
    syntaxHighlighter?: HighlighterExtension;
    containerRef?: RefObject<HTMLDivElement>;
};

export type ChatSegmentImperativeProps<AiMsg> = {
    streamChunk: (messageId: string, chunk: string) => void;
    completeStream: (messageId: string) => void;
};
