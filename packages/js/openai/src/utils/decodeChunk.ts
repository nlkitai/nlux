import OpenAI from 'openai';

export const decodeChunk = (
    payload: OpenAI.Chat.Completions.ChatCompletionChunk,
): string | undefined => {
    if (!payload.choices || !payload.choices[0]) {
        throw Error('Invalid payload');
    }

    const content: unknown = payload.choices[0].delta.content;
    if (typeof content !== 'string') {
        return undefined;
    }

    return content;
};
