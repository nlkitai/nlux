import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// ⚠️ Start by adding your API key to .env.local as OPENAI_API_KEY

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { prompt } = await req.json();

    const result = await streamText({
        model: openai('gpt-4-turbo'),
        messages: [{
            role: 'system',
            content: prompt,
        }],
        async onFinish() {
            // implement your own logic here, e.g. for storing messages
            // or recording token usage
        },
    });

    return result.toTextStreamResponse();
}
