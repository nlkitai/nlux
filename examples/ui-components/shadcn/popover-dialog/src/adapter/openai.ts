import {ChatAdapter, StreamingAdapterObserver} from '@nlux/react';

// A demo API by NLUX that connects to OpenAI
// and returns a stream of Server-Sent events
const demoProxyServerUrl = "https://gptalks.api.nlux.dev/openai/chat/stream";

// If you are looking to build your own AI endpoint, you can check the Getting Started guides on NLUX
// that explain how to integrate with Next.js, Node.js, LangServe, and other frameworks.
// https://docs.nlkit.com/nlux/learn/get-started/

// Adapter to send query to the server and receive a stream of chunks as response
export const openAiAdapter: () => ChatAdapter = () => ({
    streamText: async (
        prompt: string,
        observer: StreamingAdapterObserver,
    ) => {
        const body = {prompt};
        const response = await fetch(demoProxyServerUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        });

        if (response.status !== 200) {
            observer.error(new Error('Failed to connect to the server'));
            return;
        }

        if (!response.body) {
            return;
        }

        // Read a stream of server-sent events
        // and feed them to the observer as they are being generated
        const reader = response.body.getReader();
        const textDecoder = new TextDecoder();

        let doneStream = false;
        while (!doneStream) {
            const {value, done} = await reader.read();
            if (done) {
                doneStream = true;
            } else {
                const content = textDecoder.decode(value);
                if (content) {
                    observer.next(content);
                }
            }
        }

        observer.complete();
    },
});
