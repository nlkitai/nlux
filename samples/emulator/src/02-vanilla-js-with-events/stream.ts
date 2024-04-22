import {ChatAdapter, StreamingAdapterObserver} from '@nlux/react';

const demoProxyServerUrl = 'https://demo.api.nlux.ai/openai/chat/stream';

export const streamAdapter: ChatAdapter<string> = {
    streamText: async (prompt: string, observer: StreamingAdapterObserver) => {
        const body = {prompt};
        let response: Response | undefined = undefined;

        try {
            response = await fetch(demoProxyServerUrl, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (e) {
            observer.error(new Error('Failed to connect to the server'));
            return;
        }

        if (!response?.body) {
            observer.error(new Error('No response body'));
            return;
        }

        // Read a stream of server-sent events
        // and feed them to the observer as they are being generated
        const reader = response.body.getReader();
        const textDecoder = new TextDecoder();
        let doneReading = false;

        while (!doneReading) {
            const {value, done} = await reader.read();
            if (done) {
                doneReading = true;
                continue;
            }

            const content = textDecoder.decode(value);
            if (content) {
                observer.next(content);
            }
        }

        observer.complete();
    },
};
