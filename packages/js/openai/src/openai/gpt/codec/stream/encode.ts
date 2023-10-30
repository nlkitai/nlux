import {Message} from '@nlux/nlux';
import OpenAI from 'openai';

export const encode = async (
    message: Message,
): Promise<
    OpenAI.Chat.Completions.ChatCompletionMessageParam
> => {
    return {
        role: 'user',
        content: message as string,
    };
};
