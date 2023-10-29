import {AdapterBuilder} from '../types/adapterBuilder';
import {ExposedConfig} from './config';

export interface IConvoPit {
    get config(): ExposedConfig;

    mount(rootElement: HTMLElement): void;

    get mounted(): boolean;

    unmount(): void;

    withAdapter<InboundPayload, OutboundPayload>(
        adapterBuilder: AdapterBuilder<InboundPayload, OutboundPayload>,
    ): IConvoPit;

    withTheme(theme: string): IConvoPit;
}
