import {Adapter} from '@nlux/react';

// A demo endpoint by nlux that connects that uses LangServe to connect to OpenAI.
const demoLangServerEndpoint = 'https://pynlux.api.nlux.ai/einbot/invoke';

const promptToBody = (message: string) => {
    return JSON.stringify({
        input: {
            message,
        },
    });
};

export const fetchAdapter: Adapter = {
    fetchText: async (prompt: string): Promise<string> => {
        const response = await fetch(demoLangServerEndpoint, {
            method: 'POST',
            body: promptToBody(prompt),
        });

        const result = await response.json();

        if (typeof result?.output?.content === 'string') {
            return result.output.content;
        } else {
            throw new Error('Invalid response from server');
        }
    },
};
