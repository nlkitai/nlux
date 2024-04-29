import {HighlighterExtension} from '@nlux/core';
import {ReactElement} from 'react';
import {MessageDirection} from '../../../../../shared/src/ui/Message/props';
import {ResponseComponent} from '../../exports/messageOptions';

export type ChatItemProps<AiMsg> = {
    uid: string;
    direction: MessageDirection;
    status: 'streaming' | 'complete';
    message?: AiMsg | string;
    responseRenderer?: ResponseComponent<AiMsg>;
    name?: string;
    picture?: string | ReactElement;
    syntaxHighlighter?: HighlighterExtension;
    openLinksInNewWindow?: boolean;
};

export type ChatItemImperativeProps = {
    streamChunk: (chunk: string) => void;
    completeStream: () => void;
};
