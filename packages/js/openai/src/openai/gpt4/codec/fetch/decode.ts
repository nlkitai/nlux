import {Message} from '@nlux/nlux';
import OpenAI from 'openai';

export const decode = async (
    payload: OpenAI.Chat.Completions.ChatCompletion,
): Promise<Message> => {
    if (!payload.choices || !payload.choices[0]) {
        throw Error('Invalid payload');
    }

    const content = payload.choices[0].message.content;
    if (typeof content !== 'string') {
        return undefined;
    }

    return content;
};
