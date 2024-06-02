import {ConversationLayout} from '@nlux/core';
import {ReactElement, RefObject} from 'react';
import {ChatSegment} from '@shared/types/chatSegment/chatSegment';
import {MessageOptions} from '../../exports/messageOptions';
import {PersonaOptions} from '../../exports/personaOptions';

export type ChatSegmentProps<AiMsg> = {
    chatSegment: ChatSegment<AiMsg>
    loader?: ReactElement;
    personaOptions?: PersonaOptions;
    messageOptions?: MessageOptions<AiMsg>;
    layout: ConversationLayout;
    containerRef?: RefObject<HTMLDivElement>;
};

export type ChatSegmentImperativeProps<AiMsg> = {
    streamChunk: (messageId: string, chunk: AiMsg) => void;
    completeStream: (messageId: string) => void;
};
