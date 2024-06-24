import {ConversationLayout, DataTransferMode} from '@nlux/core';
import {ReactElement, ReactNode} from 'react';
import {MessageDirection} from '@shared/components/Message/props';
import {MessageOptions} from '../../exports/messageOptions';
import {MarkdownContainersController} from '../../exports/hooks/usMarkdownContainers';

export type ChatItemProps<AiMsg> = {
    uid: string;
    direction: MessageDirection;
    layout: ConversationLayout;
    dataTransferMode: DataTransferMode;
    status: 'streaming' | 'complete';
    contentType: 'text' | 'server-component';
    fetchedContent?: AiMsg | ReactNode;
    fetchedServerResponse?: unknown;
    streamedContent?: AiMsg[];
    streamedServerResponse?: Array<unknown>;
    messageOptions?: MessageOptions<AiMsg>;
    name: string;
    avatar?: string | ReactElement;
    markdownContainersController: MarkdownContainersController;
};

export type ChatItemImperativeProps<AiMsg> = {
    streamChunk: (chunk: AiMsg) => void;
    completeStream: () => void;
};
