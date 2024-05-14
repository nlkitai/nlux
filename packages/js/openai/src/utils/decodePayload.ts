import OpenAI from 'openai';

export const decodePayload = <AiMsg>(
    payload: OpenAI.Chat.Completions.ChatCompletion,
) => {
    if (!payload.choices || !payload.choices[0]) {
        throw Error('Invalid payload');
    }

    const content = payload.choices[0].message?.content;
    if (content === null) {
        return undefined;
    }

    return content as unknown as AiMsg;
};
