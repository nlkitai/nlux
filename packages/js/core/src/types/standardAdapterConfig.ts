export type OutputFormat = 'text' | 'audio' | 'markdown' | 'html' | 'image' | 'video' | 'file';
export type InputFormat = 'text';

export type AdapterEncodeFunction<OutboundPayload> = (input: string) => Promise<OutboundPayload>;
export type AdapterDecodeFunction<InboundPayload> = (output: InboundPayload) => Promise<string | undefined>;

export type StandardAdapterInfo = Readonly<{
    id: string;
    capabilities: Readonly<{
        textChat: boolean;
        audio: boolean;
        fileUpload: boolean;
    }>;
    inputFormats: ReadonlyArray<InputFormat>;
    outputFormats: ReadonlyArray<OutputFormat>;
}>;

export type StandardAdapterConfig<InboundPayload, OutboundPayload> = Readonly<{
    encodeMessage: AdapterEncodeFunction<OutboundPayload>;
    decodeMessage: AdapterDecodeFunction<InboundPayload>;
}>;
