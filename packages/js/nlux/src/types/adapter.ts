import {NluxAdapterConfig, NluxAdapterInfo} from './adapterConfig';
import {StreamingAdapter, StreamingAdapterObserver} from './adapterInterface';
import {Message} from './message';

export type NluxAdapterStatus = 'disconnected'
    | 'connecting'
    | 'connected'
    | 'disconnecting'
    | 'idle'
    | 'error';

export type NluxAdapterEvent = 'state-change'
    | 'message-received'
    | 'message-sent'
    | 'chunk-received';

export type AdapterEventData = Message | NluxAdapterStatus;

export interface NluxAdapter<InboundPayload, OutboundPayload> extends StreamingAdapter {
    get config(): NluxAdapterConfig<InboundPayload, OutboundPayload>;

    decode(payload: InboundPayload): Promise<Message>;

    encode(message: Message): Promise<OutboundPayload>;

    get id(): string;

    get info(): NluxAdapterInfo;

    send(message: Message, observer: StreamingAdapterObserver): void;

    get status(): NluxAdapterStatus;
}
