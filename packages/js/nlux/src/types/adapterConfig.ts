import {Message} from './message';

export type OutputFormat = 'text' | 'audio' | 'html' | 'image' | 'video' | 'file';
export type InputFormat = 'text';

export type AdapterEncodeFunction<OutboundPayload> = (input: Message) => Promise<OutboundPayload>;
export type AdapterDecodeFunction<InboundPayload> = (output: InboundPayload) => Promise<Message>;

export type AdapterInfo = Readonly<{
    id: string;
    connectionType: 'ws' | 'http';
    capabilities: Readonly<{
        textChat: boolean;
        audio: boolean;
        fileUpload: boolean;
        replyToSingleMessage: boolean;
    }>;
    readonly remote: Readonly<{
        url: string;
    }>,
    inputFormats: ReadonlyArray<InputFormat>;
    outputFormats: ReadonlyArray<OutputFormat>;
}>;

export type AdapterConfig<InboundPayload, OutboundPayload> = Readonly<{
    encodeMessage: AdapterEncodeFunction<OutboundPayload>;
    decodeMessage: AdapterDecodeFunction<InboundPayload>;
}>;
