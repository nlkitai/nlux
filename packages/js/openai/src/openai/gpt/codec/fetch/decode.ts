import OpenAI from 'openai';

export const decode = async (
    payload: OpenAI.Chat.Completions.ChatCompletion,
): Promise<string | undefined> => {
    if (!payload.choices || !payload.choices[0]) {
        throw Error('Invalid payload');
    }

    const content = payload.choices[0].message.content;
    if (typeof content !== 'string') {
        return undefined;
    }

    return content;
};
