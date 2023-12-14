import {AdapterBuilder} from '../types/adapterBuilder';
import {NluxProps} from '../types/props';
import {HighlighterExtension} from './highlighter/highlighter';
import {ConversationOptions} from './options/conversationOptions';
import {LayoutOptions} from './options/layoutOptions';
import {PromptBoxOptions} from './options/promptBoxOptions';

export interface IAiChat {
    mount(rootElement: HTMLElement): void;

    get mounted(): boolean;

    unmount(): void;

    updateProps(props: Partial<NluxProps>): void;

    withAdapter<InboundPayload, OutboundPayload>(
        adapterBuilder: AdapterBuilder<InboundPayload, OutboundPayload>,
    ): IAiChat;

    withClassName(
        className: string,
    ): IAiChat;
    withConversationOptions(
        conversationOptions: ConversationOptions,
    ): IAiChat;
    withLayoutOptions(
        layoutOptions: LayoutOptions,
    ): IAiChat;
    withPromptBoxOptions(
        promptBoxOptions: PromptBoxOptions,
    ): IAiChat;
    withSyntaxHighlighter(
        syntaxHighlighter: HighlighterExtension,
    ): IAiChat;
    withTheme(
        themeId: string,
    ): IAiChat;
}
