export default `import { StreamSend, StreamingAdapterObserver } from '@nlux/react';

// OpenAI-compatible API endpoint (py-demo-api)
// Supports multiple providers (OpenAI, Anthropic, Google)
const apiUrl = 'https://py-demo-api.fly.dev/api/v1/chat/completions';

// Function to send query to the server and receive a stream of chunks as response
export const send: StreamSend = async (
    prompt: string,
    observer: StreamingAdapterObserver,
) => {
    const body = {
        messages: [
            {role: 'user', content: prompt}
        ],
        stream: true,
        provider: 'openai',
        temperature: 0.7
    };

    const response = await fetch(apiUrl, {
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
    let buffer = '';

    while (true) {
        const {value, done} = await reader.read();
        if (done) {
            break;
        }

        buffer += textDecoder.decode(value, {stream: true});
        const lines = buffer.split('\\n');
        
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const data = JSON.parse(line.slice(6));
                    
                    if (data.error) {
                        observer.error(new Error(data.error));
                        return;
                    }
                    
                    if (data.content) {
                        observer.next(data.content);
                    }
                    
                    if (data.done) {
                        observer.complete();
                        return;
                    }
                } catch (e) {
                    // Skip invalid JSON lines
                    console.warn('Failed to parse SSE data:', line);
                }
            }
        }
    }

    observer.complete();
};
`;