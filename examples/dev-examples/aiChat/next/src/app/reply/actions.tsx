'use server';

// An AI reply in the form of a React Server Component
// that will get rendered inside NLUX AiChat.

type AiReactComponentReplyProps = {
    prompt?: string;
};

export const reply = async function AiReactComponentReply({prompt}: AiReactComponentReplyProps = {}) {
    // Fetch a response
    const response = await fetch('https://gptalks.api.nlux.dev/openai/chat/fetch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            prompt: prompt ?? 'Hello',
        }),
    });

    const data = await response.json();
    if (typeof data.content !== 'string') {
        return (
            <div>
                Invalid server response
            </div>
        );
    }

    // Return a server component
    return (
        <div>
            <h1>The AI Said:</h1>
            <p>
                {data.content}
            </p>
        </div>
    );
};
