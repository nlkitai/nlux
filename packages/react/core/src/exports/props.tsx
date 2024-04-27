import {
    ChatAdapter,
    ChatAdapterBuilder,
    ChatItem,
    ConversationOptions,
    EventsMap,
    LayoutOptions,
    MessageOptions,
    PromptBoxOptions,
} from '@nlux/core';
import {PersonaOptions} from './personaOptions';

/**
 * Props for the AiChat component.
 */
export type AiChatComponentProps<AiMsg> = {
    /**
     * The chat adapter to use.
     * This can be an instance of a chat adapter, or a chat adapter builder.
     */
    adapter: ChatAdapter<AiMsg> | ChatAdapterBuilder<AiMsg>;

    /**
     * A map of event handlers.
     */
    events?: Partial<EventsMap<AiMsg>>;

    /**
     * The class name to add to the root element of the component.
     */
    className?: string;

    /**
     * The theme ID to use.
     * This should be the ID of a theme that has been loaded into the page.
     */
    themeId?: string;

    /**
     * The initial conversation to display.
     */
    initialConversation?: ChatItem<AiMsg>[];

    /**
     * Options for the conversation.
     */
    conversationOptions?: ConversationOptions;

    /**
     * Layout options.
     */
    layoutOptions?: LayoutOptions;

    /**
     * Options related to a single message in the conversation.
     */
    messageOptions?: MessageOptions<AiMsg>;

    /**
     * Options for the prompt box.
     */
    promptBoxOptions?: PromptBoxOptions;

    /**
     * Options for the persona.
     */
    personaOptions?: PersonaOptions;
};
