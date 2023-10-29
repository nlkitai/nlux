import {Adapter} from '../adapter';

export interface ISseAdapter<InboundPayload, OutboundPayload> extends Adapter<
    InboundPayload, OutboundPayload
> {
    connect?(): Promise<void>;

    disconnect?(): Promise<void>;

    isConnected?(): Promise<boolean>;
}
