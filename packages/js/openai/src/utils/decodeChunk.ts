import OpenAI from 'openai';

export const decodeChunk = async (
    payload: OpenAI.Chat.Completions.ChatCompletionChunk,
): Promise<string | undefined> => {
    if (!payload.choices || !payload.choices[0]) {
        throw Error('Invalid payload');
    }

    const content = payload.choices[0].delta.content;
    if (typeof content !== 'string') {
        return undefined;
    }

    return content;
};
