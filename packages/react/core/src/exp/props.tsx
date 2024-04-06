import {
    ChatAdapter,
    ChatAdapterBuilder,
    ChatItem,
    ConversationOptions,
    EventsMap,
    HighlighterExtension,
    LayoutOptions,
    PromptBoxOptions,
} from '@nlux/core';
import {ReactElement} from 'react';
import {PersonaOptions} from './personaOptions';

export type AiChatComponentProps<MessageType = string> = {
    adapter: ChatAdapter | ChatAdapterBuilder;
    events?: Partial<EventsMap>;
    className?: string;
    initialConversation?: ChatItem<MessageType>[];
    syntaxHighlighter?: HighlighterExtension;
    conversationOptions?: ConversationOptions;
    customMessageComponent?: <MessageType>(message: MessageType) => ReactElement | null;
    layoutOptions?: LayoutOptions;
    promptBoxOptions?: PromptBoxOptions;
    personaOptions?: PersonaOptions;
};
