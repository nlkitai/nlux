import {StreamingAdapterObserver} from '@nlux/react';

// We connect to /api/chat to stream text from the server
// We use HTTP POST to send the prompt to the server, and receive a stream of server-sent events
// We use the observer object passed by NLUX to send chunks of text to <AiChat />
export const streamText = async (prompt: string, observer: StreamingAdapterObserver) => {

    const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({prompt: prompt}),
        headers: {'Content-Type': 'application/json'},
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

    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            break;
        }

        const content = textDecoder.decode(value);
        if (content) {
            observer.next(content);
        }
    }

    observer.complete();
};
