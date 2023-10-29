import {AdapterBuilder, ConversationOptions, MessageOptions, PromptBoxOptions} from '@nlux/nlux';

export type ConvoPitProps = {
    /**
     * The adapter builder to use for the conversation. This can be obtained via useAdapter() hook for provided
     * adapters or by creating your own adapter.
     */
    adapter: AdapterBuilder<any, any>;

    /**
     * CSS class name
     */
    className?: string;

    /**
     * Max height of the container. If the container exceeds this height, it will scroll.
     * The max height is applied to the container via the style attribute.
     */
    containerMaxHeight?: number;

    /**
     * The `id` of the theme to use for UI component.
     * If no theme is provided, the default theme will be used.
     */
    theme?: string;

    /**
     * The options to use for the conversation.
     */
    messageOptions?: MessageOptions;

    /**
     * The options to use for the conversation.
     */
    conversationOptions?: ConversationOptions;

    /**
     * The options to use for the prompt box.
     */
    promptBoxOptions?: PromptBoxOptions;
};
