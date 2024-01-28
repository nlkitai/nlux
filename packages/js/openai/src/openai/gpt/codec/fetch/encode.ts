import {AdapterEncodeFunction} from '@nlux/core';
import OpenAI from 'openai';

export const encode: AdapterEncodeFunction<
    OpenAI.Chat.Completions.ChatCompletionMessageParam
> = async (
    message: string,
): Promise<
    OpenAI.Chat.Completions.ChatCompletionMessageParam
> => {
    return {
        role: 'user',
        content: message as string,
    };
};
