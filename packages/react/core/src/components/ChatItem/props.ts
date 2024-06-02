import {ConversationLayout, DataTransferMode} from '@nlux/core';
import {ReactElement} from 'react';
import {MessageDirection} from '@shared/components/Message/props';
import {MessageOptions} from '../../exports/messageOptions';

export type ChatItemProps<AiMsg> = {
    uid: string;
    direction: MessageDirection;
    layout: ConversationLayout;
    dataTransferMode: DataTransferMode;
    status: 'streaming' | 'complete';
    fetchedContent?: AiMsg;
    fetchedServerResponse?: unknown;
    streamedContent?: AiMsg[];
    streamedServerResponse?: Array<unknown>;
    messageOptions?: MessageOptions<AiMsg>;
    name: string;
    avatar?: string | ReactElement;
};

export type ChatItemImperativeProps<AiMsg> = {
    streamChunk: (chunk: AiMsg) => void;
    completeStream: () => void;
};
