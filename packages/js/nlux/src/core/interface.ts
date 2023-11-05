import {AdapterBuilder} from '../types/adapterBuilder';
import {NluxProps} from '../types/props';
import {ConversationOptions} from './options/conversationOptions';
import {LayoutOptions} from './options/layoutOptions';
import {PromptBoxOptions} from './options/promptBoxOptions';

export interface IConvoPit {
    mount(rootElement: HTMLElement): void;

    get mounted(): boolean;

    unmount(): void;

    updateProps(props: Partial<NluxProps>): void;

    withAdapter<InboundPayload, OutboundPayload>(
        adapterBuilder: AdapterBuilder<InboundPayload, OutboundPayload>,
    ): IConvoPit;

    withClassName(
        className: string,
    ): IConvoPit;

    withConversationOptions(
        conversationOptions: ConversationOptions,
    ): IConvoPit;

    withLayoutOptions(
        layoutOptions: LayoutOptions,
    ): IConvoPit;

    withPromptBoxOptions(
        promptBoxOptions: PromptBoxOptions,
    ): IConvoPit;
}
