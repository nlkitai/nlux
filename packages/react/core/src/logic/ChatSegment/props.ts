import {HighlighterExtension} from '@nlux/core';
import {FunctionComponent, ReactElement, RefObject} from 'react';
import {ChatSegment} from '../../../../../shared/src/types/chatSegment/chatSegment';
import {PersonaOptions} from '../../exports/personaOptions';

export type ChatSegmentProps<AiMsg> = {
    chatSegment: ChatSegment<AiMsg>
    responseRenderer?: FunctionComponent<{response: AiMsg}>;
    loader?: ReactElement;
    personaOptions?: PersonaOptions;
    syntaxHighlighter?: HighlighterExtension;
    openLinksInNewWindow?: boolean;
    containerRef?: RefObject<HTMLDivElement>;
};

export type ChatSegmentImperativeProps = {
    streamChunk: (messageId: string, chunk: string) => void;
    completeStream: (messageId: string) => void;
};
