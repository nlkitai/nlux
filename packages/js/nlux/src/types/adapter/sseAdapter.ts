import {NluxAdapter} from '../adapter';

export interface ISseAdapter<InboundPayload, OutboundPayload> extends NluxAdapter<
    InboundPayload, OutboundPayload
> {
    connect?(): Promise<void>;

    disconnect?(): Promise<void>;

    isConnected?(): Promise<boolean>;
}
