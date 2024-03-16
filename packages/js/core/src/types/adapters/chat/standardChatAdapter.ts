import {ChatAdapterExtras} from './chaAdapterExtras';
import {StreamingAdapterObserver} from './chatAdapter';
import {StandardAdapterInfo} from './standardAdapterConfig';

/**
 * This interface is used by standard adapters provided by nlux to communicate with the AiChat component.
 */
export interface StandardChatAdapter {
    get dataTransferMode(): 'stream' | 'fetch';

    fetchText(
        message: string,
        extras: ChatAdapterExtras,
    ): Promise<string>;

    get id(): string;
    get info(): StandardAdapterInfo;

    streamText(
        message: string,
        observer: StreamingAdapterObserver,
        extras: ChatAdapterExtras,
    ): void;
}

/**
 * This function is used to determine if an object is a standard chat adapter or not.
 * @param adapter
 */
export const isStandardChatAdapter = (adapter: any): boolean => {
    return (typeof adapter === 'object' && adapter !== null)
        && (typeof adapter.streamText === 'function' || typeof adapter.fetchText === 'function')
        && ['stream', 'fetch'].includes(adapter.dataTransferMode)
        && typeof adapter.id === 'string'
        && (typeof adapter.info === 'object' && adapter.info !== null);
};
