import {AdapterBuilder, ConversationOptions, LayoutOptions, PromptBoxOptions} from '@nlux/nlux';

/**
 * Properties for the NluxConvo React component.
 */
export type NluxConvoProps = {
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
     * The options to use for the conversation.
     */
    conversationOptions?: ConversationOptions;

    /**
     * The options to use for the layout.
     */
    layoutOptions?: LayoutOptions;

    /**
     * The options to use for the prompt box.
     */
    promptBoxOptions?: PromptBoxOptions;
};
