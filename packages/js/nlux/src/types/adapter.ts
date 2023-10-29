import {Observable} from '../core/bus/observable';
import {AdapterConfig, AdapterInfo} from './adapterConfig';
import {Message} from './message';

export type AdapterStatus = 'disconnected'
    | 'connecting'
    | 'connected'
    | 'disconnecting'
    | 'idle'
    | 'error';

export type AdapterEvent = 'state-change'
    | 'message-received'
    | 'message-sent'
    | 'chunk-received';

export type AdapterEventData = Message | AdapterStatus;

export interface Adapter<InboundPayload, OutboundPayload> {
    get config(): AdapterConfig<InboundPayload, OutboundPayload>;

    decode(payload: InboundPayload): Promise<Message>;

    encode(message: Message): Promise<OutboundPayload>;

    get id(): string;

    get info(): AdapterInfo;

    send(message: Message): Observable<Message>;

    get status(): AdapterStatus;
}
