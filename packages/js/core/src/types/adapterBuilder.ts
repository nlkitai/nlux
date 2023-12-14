import {StandardAdapter} from './standardAdapter';

export interface AdapterBuilder<InboundPayload, OutboundPayload> {
    create(): StandardAdapter<InboundPayload, OutboundPayload>;
}
