import {Adapter} from './adapter';

export interface AdapterBuilder<InboundPayload, OutboundPayload> {
    create(): Adapter<InboundPayload, OutboundPayload>;
}
