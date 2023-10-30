export type GptOutboundPayload = Readonly<{
    model: string;
    messages: Array<{
        role: 'user' | 'system' | 'bot';
        content: string;
    }>;
}>;
