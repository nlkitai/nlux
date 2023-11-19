import {AdapterEventData, NluxAdapter, NluxAdapterEvent} from '../adapter';

export interface IFetchAdapter<InboundPayload, OutboundPayload> extends NluxAdapter<
    InboundPayload, OutboundPayload
> {
    subscribe<PayloadType extends AdapterEventData>(
        event: NluxAdapterEvent,
        callback: (eventPayload: PayloadType) => {},
    ): void;

    unsubscribe<PayloadType extends AdapterEventData>(
        event: NluxAdapterEvent,
        callback: (eventPayload: PayloadType) => {},
    ): void;
}
