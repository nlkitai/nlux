export interface ConversationOptions {
    /**
     * Indicates whether the conversation should be scrolled to the bottom when a new message is added.
     * @default true
     */
    scrollWhenGenerating?: boolean;

    /**
     * The interval in milliseconds at which new characters are added to the conversation when a message
     * is being generated and rendering in the UI.
     * Set to `null` to disable the streaming animation.
     * @default 10
     */
    streamingAnimationSpeed?: number | null;
}
