import {ConversationLayout, DataTransferMode} from '@nlux/core';
import {ReactElement, ReactNode} from 'react';
import {MessageDirection} from '@shared/components/Message/props';
import {MessageOptions} from '../../exports/messageOptions';
import {MarkdownContainersController} from '../../exports/hooks/usMarkdownContainers';

export type ChatItemProps<AiMsg> = {
    uid: string;
    status: 'streaming' | 'complete';
    direction: MessageDirection;
    contentType: 'text' | 'server-component';
    dataTransferMode: DataTransferMode;

    markdownContainersController: MarkdownContainersController;
    onMarkdownStreamRendered?: (chatItemId: string) => void;

    fetchedContent?: AiMsg | ReactNode;
    fetchedServerResponse?: unknown;
    streamedContent?: AiMsg[];
    streamedServerResponse?: Array<unknown>;

    messageOptions?: MessageOptions<AiMsg>;
    layout: ConversationLayout;
    isPartOfInitialSegment: boolean;
    name: string;
    avatar?: string | ReactElement;
    submitShortcutKey?: 'Enter' | 'CommandEnter';
    onPromptResubmit?: (newPrompt: string) => void;
};

export type ChatItemImperativeProps<AiMsg> = {
    streamChunk: (chunk: AiMsg) => void;
    completeStream: () => void;
    cancelStream: () => void;
};
