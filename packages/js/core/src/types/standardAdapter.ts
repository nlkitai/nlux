import {Adapter, AdapterExtras, DataTransferMode, StreamingAdapterObserver} from './adapter';
import {StandardAdapterConfig, StandardAdapterInfo} from './standardAdapterConfig';

export interface StandardAdapter<InboundPayload, OutboundPayload> extends Adapter {
    get config(): StandardAdapterConfig<InboundPayload, OutboundPayload>;
    get dataTransferMode(): DataTransferMode;
    decode(payload: InboundPayload): Promise<string | undefined>;
    encode(message: string): Promise<OutboundPayload>;
    fetchText(message: string, extras: AdapterExtras): Promise<string>;
    get id(): string;
    get info(): StandardAdapterInfo;
    streamText(message: string, observer: StreamingAdapterObserver, extras: AdapterExtras): void;
}

export const isStandardAdapter = (adapter: Adapter): boolean => {
    return 'config' in adapter
        && 'dataTransferMode' in adapter
        && 'decode' in adapter
        && 'encode' in adapter
        && 'id' in adapter
        && 'info' in adapter
        && ('fetchText' in adapter || 'streamText' in adapter);
};
