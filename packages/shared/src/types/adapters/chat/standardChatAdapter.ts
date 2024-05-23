import {DataTransferMode, StreamingAdapterObserver} from './chatAdapter';
import {ChatAdapterExtras} from './chatAdapterExtras';
import {StandardAdapterInfo} from './standardAdapterConfig';

/**
 * This interface is used by standard adapters provided by nlux to communicate with the AiChat component.
 */
export interface StandardChatAdapter<AiMsg = string> {
    get dataTransferMode(): DataTransferMode;

    fetchText(
        message: string,
        extras: ChatAdapterExtras<AiMsg>,
    ): Promise<string | object | undefined>;

    get id(): string;
    get info(): StandardAdapterInfo;

    // Receives a message from the API and returns a message that can be sent to the user.
    // This method is called by AiChat when the API sends a message to convert that message into a format that
    preProcessAiStreamedChunk(
        chunk: string | object | undefined,
        extras: ChatAdapterExtras<AiMsg>,
    ): AiMsg | undefined;

    // can be displayed to the user (either text or input for a custom component).
    preProcessAiUnifiedMessage(
        message: string | object | undefined,
        extras: ChatAdapterExtras<AiMsg>,
    ): AiMsg | undefined;

    streamText(
        message: string,
        observer: StreamingAdapterObserver<string | object | undefined>,
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
        && (typeof typedAdapter.info === 'object' && typedAdapter.info !== null)
        && (typeof typedAdapter.preProcessAiUnifiedMessage === 'function')
        && (typeof typedAdapter.preProcessAiStreamedChunk === 'function');
};
