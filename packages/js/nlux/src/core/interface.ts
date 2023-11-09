import {AdapterBuilder} from '../types/adapterBuilder';
import {NluxProps} from '../types/props';
import {ConversationOptions} from './options/conversationOptions';
import {LayoutOptions} from './options/layoutOptions';
import {PromptBoxOptions} from './options/promptBoxOptions';

export interface INluxConvo {
    mount(rootElement: HTMLElement): void;

    get mounted(): boolean;

    unmount(): void;

    updateProps(props: Partial<NluxProps>): void;

    withAdapter<InboundPayload, OutboundPayload>(
        adapterBuilder: AdapterBuilder<InboundPayload, OutboundPayload>,
    ): INluxConvo;

    withClassName(
        className: string,
    ): INluxConvo;

    withConversationOptions(
        conversationOptions: ConversationOptions,
    ): INluxConvo;

    withLayoutOptions(
        layoutOptions: LayoutOptions,
    ): INluxConvo;

    withPromptBoxOptions(
        promptBoxOptions: PromptBoxOptions,
    ): INluxConvo;
}
