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
    isInitialSegment: boolean;

    containerRef?: RefObject<HTMLDivElement>;
    markdownContainersController: MarkdownContainersController;
    submitShortcutKey?: 'Enter' | 'CommandEnter';

    // Callbacks
    onPromptResubmit: (segmentId: string, messageId: string, newPrompt: string) => void;
    onMarkdownStreamRendered: (segmentId: string, messageId: string) => void;

    // UI overrides
    Loader: ReactElement;
};

export type ChatSegmentImperativeProps<AiMsg> = {
    streamChunk: (messageId: string, chunk: AiMsg) => void;
    completeStream: (messageId: string) => void;
    cancelStreams: () => void;
};
