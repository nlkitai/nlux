export type DataTransferMode = 'stream' | 'fetch';

export type SendInStreamMode<MessageType = string> = (message: MessageType, observer: StreamingAdapterObserver) => void;
export type SendInFetchMode<MessageType = string> = (message: MessageType) => Promise<MessageType> | void;

export interface Adapter<MessageType = string> {
    /**
     * This method should be implemented by any adapter to be used with Nlux.
     * Either send a message to the API and notify the observer of any new message received (as in `SendInStreamMode`),
     * or return a promise that resolves to a message (as in `SendInFetchMode`).
     *
     * @param {MessageType} message
     * @param {StreamingAdapterObserver} observer
     * @returns {Promise<MessageType> | void}
     */
    send: SendInStreamMode | SendInFetchMode;
}

export interface StreamingAdapterObserver<MessageType = string> {
    complete(): void;
    error(error: Error): void;
    next(message: MessageType): void;
}
