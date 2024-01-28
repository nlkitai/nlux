import {AdapterDecodeFunction} from '@nlux/core';
import OpenAI from 'openai';

export const decode: AdapterDecodeFunction<
    OpenAI.Chat.Completions.ChatCompletion
> = async (
    payload: OpenAI.Chat.Completions.ChatCompletion,
): Promise<string | undefined> => {
    if (!payload.choices || !payload.choices[0]) {
        throw Error('Invalid payload');
    }

    const content = payload.choices[0].message?.content;
    if (content === null) {
        return undefined;
    }

    return content;
};
