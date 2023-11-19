import {NluxAdapter} from '../adapter';

export interface IWebSocketAdapter<InboundPayload, OutboundPayload> extends NluxAdapter<
    InboundPayload, OutboundPayload
> {
    connect?(): Promise<void>;

    disconnect?(): Promise<void>;

    isConnected?(): Promise<boolean>;
}
