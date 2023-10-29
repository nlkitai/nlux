import {Adapter} from './adapter';

export type NluxContext<InboundPayload = any, OutboundPayload = any> = Readonly<{
    adapter: Adapter<InboundPayload, OutboundPayload>;
}>;
