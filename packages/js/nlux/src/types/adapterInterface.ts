export interface Adapter<MessageType = string> {
    send(message: MessageType, observer?: StreamingAdapterObserver): Promise<MessageType> | void;
}

export interface PromiseAdapter<MessageType = string> extends Adapter<MessageType> {
    send(message: MessageType): Promise<MessageType>;
}

export interface StreamingAdapterObserver<MessageType = string> {
    complete(): void;
    error(error: Error): void;
    next(message: MessageType): void;
}

export interface StreamingAdapter<MessageType = string> extends Adapter<MessageType> {
    send(message: MessageType, observer: StreamingAdapterObserver): void;
}
