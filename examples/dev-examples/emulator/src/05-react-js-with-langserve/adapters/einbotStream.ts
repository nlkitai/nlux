import {ChatAdapter, StreamingAdapterObserver} from '@nlux/react';

// A demo endpoint by nlux that connects that uses LangServe to connect to OpenAI.
const demoProxyServerUrl = 'https://pynlux.api.nlkit.com/einbot/stream';

const promptToBody = (message: string) => {
    return JSON.stringify({
        input: {
            message,
        },
    });
};

export const streamAdapter: ChatAdapter<string> = {
    streamText: async (prompt: string, observer: StreamingAdapterObserver) => {
        const body = {prompt};
        const response = await fetch(demoProxyServerUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: promptToBody(prompt),
        });

        if (response.status !== 200) {
            observer.error(new Error('Failed to connect to the server'));
            return;
        }

        if (!response.body) {
            observer.error(new Error('Invalid response from server'));
            return;
        }

        // Read a stream of server-sent events
        // and feed them to the observer as they are being generated
        const reader = response.body.getReader();
        const textDecoder = new TextDecoder();

        while (true) {
            const {value, done} = await reader.read();
            if (done) {
              break;
            }

            const result = textDecoder.decode(value);
            console.log(result);

            // Example of a result:
            `
event: data
data: {"content":" Because","additional_kwargs":{},"type":"AIMessageChunk","example":false}

event: data
data: {"content":" he","additional_kwargs":{},"type":"AIMessageChunk","example":false}

event: data
data: {"content":" was","additional_kwargs":{},"type":"AIMessageChunk","example":false}
`;

            // Or
            `
event: data
data: {"content":"!","additional_kwargs":{},"type":"AIMessageChunk","example":false}

event: data
data: {"content":"","additional_kwargs":{},"type":"AIMessageChunk","example":false}

event: end
`;
        }

        observer.complete();
    },
};
