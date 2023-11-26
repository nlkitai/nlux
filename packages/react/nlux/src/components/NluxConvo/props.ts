import {Adapter, AdapterBuilder, ConversationOptions, LayoutOptions, PromptBoxOptions} from '@nlux/nlux';

/**
 * Properties for the NluxConvo React component.
 */
export type NluxConvoProps = {
    /**
     * The adapter or adapter builder to use for the conversation.
     * This can be obtained via useAdapter() hook for standard adapters or by creating your own custom adapter
     * that implements `StreamingAdapter` or `PromiseAdapter` interfaces.
     */
    adapter: Adapter | AdapterBuilder<any, any>;

    /**
     * CSS class name to be applied to the root element.
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
