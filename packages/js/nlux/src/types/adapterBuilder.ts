import {NluxAdapter} from './adapter';

export interface AdapterBuilder<InboundPayload, OutboundPayload> {
    create(): NluxAdapter<InboundPayload, OutboundPayload>;
}
