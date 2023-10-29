export type Gpt4OutboundPayload = Readonly<{
    model: string;
    messages: Array<{
        role: 'user' | 'system' | 'bot';
        content: string;
    }>;
}>;
