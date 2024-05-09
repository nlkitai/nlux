export type HistoryPayloadSize = number | 'none' | 'max';

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
     * Set to `none` or `0` to disable sending conversation history with each message.
     * Or set to a positive integer to send a specific number of messages.
     *
     * @default 'max'
     */
    historyPayloadSize?: HistoryPayloadSize;
}
