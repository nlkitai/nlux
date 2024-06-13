import {ConversationLayout} from '@nlux/core';
import {ReactElement, RefObject} from 'react';
import {ChatSegment} from '@shared/types/chatSegment/chatSegment';
import {MessageOptions} from '../../exports/messageOptions';
import {PersonaOptions} from '../../exports/personaOptions';
import {MarkdownContainersController} from '../../exports/hooks/usMarkdownContainers';

export type ChatSegmentProps<AiMsg> = {

    // State and option props
    chatSegment: ChatSegment<AiMsg>
    personaOptions?: PersonaOptions;
    messageOptions?: MessageOptions<AiMsg>;
    layout: ConversationLayout;

    containerRef?: RefObject<HTMLDivElement>;
    markdownContainersController: MarkdownContainersController;

    // UI overrides
    Loader: ReactElement;
};

export type ChatSegmentImperativeProps<AiMsg> = {
    streamChunk: (messageId: string, chunk: AiMsg) => void;
    completeStream: (messageId: string) => void;
};
