import {Adapter, AdapterExtras, DataTransferMode, StreamingAdapterObserver} from './adapter';
import {StandardAdapterInfo} from './standardAdapterConfig';

export interface StandardAdapter extends Adapter {
    get dataTransferMode(): DataTransferMode;
    fetchText(message: string, extras: AdapterExtras): Promise<string>;
    get id(): string;
    get info(): StandardAdapterInfo;
    streamText(message: string, observer: StreamingAdapterObserver, extras: AdapterExtras): void;
}

export const isStandardAdapter = (adapter: any): boolean => {
    return (typeof adapter === 'object' && adapter !== null)
        && (typeof adapter.streamText === 'function' || typeof adapter.fetchText === 'function')
        && ['stream', 'fetch'].includes(adapter.dataTransferMode)
        && typeof adapter.id === 'string'
        && (typeof adapter.info === 'object' && adapter.info !== null);
};
