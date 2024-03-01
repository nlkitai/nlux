import {ChatAdapter, ChatAdapterExtras, DataTransferMode, StreamingAdapterObserver} from './chatAdapter';
import {StandardAdapterInfo} from './standardAdapterConfig';

export interface StandardChatAdapter extends ChatAdapter {
    get dataTransferMode(): DataTransferMode;
    fetchText(message: string, extras: ChatAdapterExtras): Promise<string>;
    get id(): string;
    get info(): StandardAdapterInfo;
    streamText(message: string, observer: StreamingAdapterObserver, extras: ChatAdapterExtras): void;
}

export const isStandardChatAdapter = (adapter: any): boolean => {
    return (typeof adapter === 'object' && adapter !== null)
        && (typeof adapter.streamText === 'function' || typeof adapter.fetchText === 'function')
        && ['stream', 'fetch'].includes(adapter.dataTransferMode)
        && typeof adapter.id === 'string'
        && (typeof adapter.info === 'object' && adapter.info !== null);
};
