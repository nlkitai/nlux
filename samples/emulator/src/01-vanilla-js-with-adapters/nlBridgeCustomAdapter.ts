import {Adapter, AdapterExtras, StreamingAdapterObserver} from '@nlux/core';

export const nlBridgeCustomStreamingAdapter: Adapter = {
    streamText: (
        message: string,
        observer: StreamingAdapterObserver,
        extras: AdapterExtras,
    ) => {
        const endpoint = 'http://localhost:8899/';
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'chat-stream',
                payload: {
                    message,
                },
            }),
        }).then(async (response) => {
            if (!response.ok) {
                throw new Error(`NlBridge adapter returned status code: ${response.status}`);
            }

            if (!response.body) {
                throw new Error(`NlBridge adapter returned status code: ${response.status}`);
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

                try {
                    const chunk = textDecoder.decode(value);
                    observer.next(chunk);
                } catch (error) {
                    console.warn('Error parsing chunk', error);
                }
            }

            observer.complete();
        });
    },
};

export const nlBridgeCustomPromiseAdapter: Adapter = {
    async fetchText(message: string, extras): Promise<string> {
        const endpoint = 'http://localhost:8899/';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'chat',
                payload: {
                    message,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`NlBridge adapter returned status code: ${response.status}`);
        }

        const body = await response.json();
        if (
            typeof body === 'object' && body !== null && body.success === true &&
            typeof body.result === 'object' && body.result !== null &&
            typeof body.result.response === 'string'
        ) {
            return body.result.response;
        } else {
            throw new Error('NlBridge adapter returned invalid response');
        }
    },
};

