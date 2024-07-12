export async function aiReply(prompt: string): Promise<string> {
    const response = await fetch('https://gptalks.api.nlux.dev/openai/chat/fetch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            prompt,
        }),
    });

    const data = await response.json();
    if (typeof data.content !== 'string') {
        throw new Error('Failed to fetch text');
    }

    return data.content;
}
