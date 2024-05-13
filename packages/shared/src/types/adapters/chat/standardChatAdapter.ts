import {DataTransferMode, StreamingAdapterObserver} from './chatAdapter';
import {ChatAdapterExtras} from './chatAdapterExtras';
import {StandardAdapterInfo} from './standardAdapterConfig';

/**
 * This interface is used by standard adapters provided by nlux to communicate with the AiChat component.
 */
export interface StandardChatAdapter<AiMsg> {
    get dataTransferMode(): DataTransferMode;

    fetchText(
        message: string,
        extras: ChatAdapterExtras<AiMsg>,
    ): Promise<AiMsg>;

    get id(): string;
    get info(): StandardAdapterInfo;

    streamText(
        message: string,
        observer: StreamingAdapterObserver,
        extras: ChatAdapterExtras<AiMsg>,
    ): void;
}

/**
 * This function is used to determine if an object is a standard chat adapter or not.
 * @param adapter
 */
export const isStandardChatAdapter = (adapter: unknown): boolean => {
    if (typeof adapter !== 'object' || adapter === null) {
        return false;
    }

    const typedAdapter = adapter as Record<string, unknown>;
    return (typeof typedAdapter.streamText === 'function' || typeof typedAdapter.fetchText === 'function')
        && ['stream', 'fetch'].includes(typedAdapter.dataTransferMode as string)
        && typeof typedAdapter.id === 'string'
        && (typeof typedAdapter.info === 'object' && typedAdapter.info !== null);
};
