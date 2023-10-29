import {Adapter} from '../adapter';

export interface IWebSocketAdapter<InboundPayload, OutboundPayload> extends Adapter<
    InboundPayload, OutboundPayload
> {
    connect?(): Promise<void>;

    disconnect?(): Promise<void>;

    isConnected?(): Promise<boolean>;
}
