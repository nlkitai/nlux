import {Adapter, DataTransferMode, StreamingAdapterObserver} from './adapter';
import {Message} from './message';
import {StandardAdapterConfig, StandardAdapterInfo} from './standardAdapterConfig';

export type StandardAdapterStatus = 'disconnected'
    | 'connecting'
    | 'connected'
    | 'disconnecting'
    | 'idle'
    | 'error';

export type StandardAdapterEvent = 'state-change'
    | 'message-received'
    | 'message-sent'
    | 'chunk-received';

export type StandardAdapterEventData = Message | StandardAdapterStatus;

export interface StandardAdapter<InboundPayload, OutboundPayload> extends Adapter<Message> {
    get config(): StandardAdapterConfig<InboundPayload, OutboundPayload>;
    get dataTransferMode(): DataTransferMode;
    decode(payload: InboundPayload): Promise<Message>;
    encode(message: Message): Promise<OutboundPayload>;
    get id(): string;
    get info(): StandardAdapterInfo;
    send(message: Message, observer: StreamingAdapterObserver): void;
    send(message: Message): Promise<Message>;
    get status(): StandardAdapterStatus;
}

export const isStandardAdapter = (adapter: Adapter): boolean => {
    return 'config' in adapter
        && 'dataTransferMode' in adapter
        && 'decode' in adapter
        && 'encode' in adapter
        && 'id' in adapter
        && 'info' in adapter
        && 'send' in adapter
        && 'status' in adapter;
};
