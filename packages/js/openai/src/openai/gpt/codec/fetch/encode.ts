import OpenAI from 'openai';

export const encode = async (
    message: string,
): Promise<
    OpenAI.Chat.Completions.ChatCompletionMessageParam
> => {
    return {
        role: 'user',
        content: message as string,
    };
};
