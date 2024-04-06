import {ChatSegment, ConversationOptions, HighlighterExtension, ParticipantRole} from '@nlux/core';
import {ReactElement, ReactNode} from 'react';
import {PersonaOptions} from '../../exp/personaOptions';

export type ConversationAiMessage<MessageType> = {
    id: string;
    role: ParticipantRole;
} & ({
    message: undefined;
    status: 'loading' | 'streaming' | 'error';
} | {
    message: MessageType;
    status: 'rendered';
});

export type ConversationUserMessage = {
    id: string;
    role: ParticipantRole;
    message: string;
    status: 'rendered';
}

export type ConversationMessage<MessageType> = ConversationAiMessage<MessageType> | ConversationUserMessage;

export type ConversationCompProps<MessageType> = {
    segments: ChatSegment<MessageType>[];
    conversationOptions?: ConversationOptions;
    personaOptions?: PersonaOptions;
    customRenderer?: <MessageType>(message: MessageType) => ReactNode;
    syntaxHighlighter?: HighlighterExtension;
    loader?: ReactElement;
};

export type ImperativeConversationCompProps = {
    scrollToBottom: () => void;
    streamChunk: (segmentId: string, messageId: string, chunk: string) => void;
};
