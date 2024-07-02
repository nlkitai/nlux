import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import { env } from "process";

export async function POST(req: Request) {
  if (env.KV_REST_API_URL && env.KV_REST_API_TOKEN) {
    // Rate limiting
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, "1 d"),
    });
    const ip = req.headers.get("x-forwarded-for");

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `chat_app_ratelimit_${ip}`
    );

    if (!success) {
      return new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }

  const { prompt, messages } = await req.json();

  //  API KEY defaults to the OPENAI_API_KEY environment variable.
  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages: [
      ...messages,
      {
        role: "user",
        content: prompt,
      },
    ],
    maxTokens: 1000,

    async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
      // implement your own logic here, e.g. for storing messages
      // or recording token usage
    },
  });

  return result.toTextStreamResponse();
}
