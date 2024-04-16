import {AdapterDecodeFunction} from '@nlux/core';
import OpenAI from 'openai';

export const decodePayload: AdapterDecodeFunction<
    OpenAI.Chat.Completions.ChatCompletion
> = async <MessageType>(
    payload: OpenAI.Chat.Completions.ChatCompletion,
) => {
    if (!payload.choices || !payload.choices[0]) {
        throw Error('Invalid payload');
    }

    const content = payload.choices[0].message?.content;
    if (content === null) {
        return undefined;
    }

    // TODO - Handle other types of messages

    return content as unknown as MessageType;
};
