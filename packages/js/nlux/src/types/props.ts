import {ConversationOptions} from '../core/options/conversationOptions';
import {LayoutOptions} from '../core/options/layoutOptions';
import {PromptBoxOptions} from '../core/options/promptBoxOptions';

/**
 * Properties for the Nlux Vanilla JS component from the builder and from the React component.
 */
export type NluxProps = {
    themeId?: string;
    className?: string;
    promptBoxOptions: Partial<PromptBoxOptions>;
    conversationOptions: Partial<ConversationOptions>;
    layoutOptions: Partial<LayoutOptions>;
};
