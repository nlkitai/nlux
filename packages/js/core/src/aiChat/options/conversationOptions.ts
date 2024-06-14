import {ConversationStarter} from '../../types/conversationStarter';

export type HistoryPayloadSize = number | 'max';

export type ConversationLayout = 'bubbles' | 'list';

export interface ConversationOptions {
    /**
     * Indicates whether the conversation should be scrolled to the bottom when a new message is added.
     *
     * @default true
     */
    autoScroll?: boolean;

    /**
     * Indicates the number of messages from conversation history that should be sent to the backend with each message.
     * For custom adapters, the history will be available as part of `extras.conversationHistory` attribute.
     * For standard adapters, the history will be automatically handled by the adapter.
     *
     * By default, the entire conversation history is sent with each message.
     * Set to `0` to disable sending conversation history with each message.
     * Or set to a positive integer to send a specific number of messages.
     *
     * @default 'max'
     */
    historyPayloadSize?: HistoryPayloadSize;

    /**
     * Indicates how items in the conversation should be displayed.
     *
     * - `list`: Chat items are displayed as a list with the AI responses underneath each user message.
     * - `bubbles`: Items are displayed as chat bubbles with the prompts on the right and the AI messages on the left.
     *
     * @default 'bubbles'
     */
    layout?: ConversationLayout;

    /**
     * Indicates whether the welcome message should be displayed when no conversation history is provided.
     * The welcome message consists of:
     * - The assistant's name and avatar
     * - The assistant's tagline as configured in the `personaOptions`
     *
     * When no assistant persona is provided, the welcome message will be the NLUX logo.
     */
    showWelcomeMessage?: boolean;


    /**
     * Suggested prompts to display in the UI to help the user start a conversation.
     * Conversation starters are only displayed when the conversation is empty, and no conversation history is present.
     */
    conversationStarters?: ConversationStarter[];
}
