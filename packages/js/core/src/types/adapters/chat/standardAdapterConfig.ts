export type OutputFormat = 'text' | 'audio' | 'markdown' | 'html' | 'image' | 'video' | 'file';
export type InputFormat = 'text';

export type AdapterEncodeFunction<OutboundPayload> = (input: string) => Promise<OutboundPayload>;
export type AdapterDecodeFunction<InboundPayload> = <AiMsg>(output: InboundPayload) => Promise<AiMsg | undefined>;

/**
 * This type represents the information that the AiChat needs to know about an adapter.
 * It is used to determine which adapters are available and what capabilities they have.
 */
export type StandardAdapterInfo = Readonly<{
    id: string;
    capabilities: Readonly<{
        chat: boolean;
        fileUpload: boolean;
        textToSpeech: boolean;
        speechToText: boolean;
    }>;
}>;
