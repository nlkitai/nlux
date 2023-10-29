import {Adapter, AdapterEvent, AdapterEventData} from '../adapter';

export interface IFetchAdapter<InboundPayload, OutboundPayload> extends Adapter<
    InboundPayload, OutboundPayload
> {
    subscribe<PayloadType extends AdapterEventData>(
        event: AdapterEvent,
        callback: (eventPayload: PayloadType) => {},
    ): void;

    unsubscribe<PayloadType extends AdapterEventData>(
        event: AdapterEvent,
        callback: (eventPayload: PayloadType) => {},
    ): void;
}
