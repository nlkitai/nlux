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
import {FunctionComponent} from 'react';
import {PersonaOptions} from './personaOptions';

export type AiChatComponentProps<MessageType> = {
    adapter: ChatAdapter | ChatAdapterBuilder;
    events?: Partial<EventsMap>;
    className?: string;
    initialConversation?: ChatItem<MessageType>[];
    syntaxHighlighter?: HighlighterExtension;
    conversationOptions?: ConversationOptions;
    aiMessageComponent?: FunctionComponent<{message: MessageType}>;
    layoutOptions?: LayoutOptions;
    promptBoxOptions?: PromptBoxOptions;
    personaOptions?: PersonaOptions;
};
