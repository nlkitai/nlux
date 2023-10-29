export type Gpt4InboundPayload = Readonly<{
    success: boolean;
    data?: {
        id: string;
        object: 'chat.completion';
        model: string;
        created: number;
        choices: Array<{
            finish_reason: string;
            index: number;
            message: {
                content: string;
                role: string;
            },
        }>,
        usage: {
            completion_tokens: number;
            prompt_tokens: number;
            total_tokens: number;
        }
    }
}>;
