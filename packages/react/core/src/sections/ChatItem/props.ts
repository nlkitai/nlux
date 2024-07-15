import {ConversationLayout, DataTransferMode} from '@nlux/core';
import {MessageDirection} from '@shared/components/Message/props';
import {ReactElement, ReactNode} from 'react';
import {MarkdownContainersController} from '../../exports/hooks/usMarkdownContainers';
import {MessageOptions} from '../../exports/messageOptions';

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
