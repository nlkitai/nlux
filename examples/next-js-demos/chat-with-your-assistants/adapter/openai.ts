import { clipChatMessagesUpToNTokens } from "@/lib/conversations";
import {
  ChatAdapter,
  ChatAdapterExtras,
  ChatItem,
  StreamingAdapterObserver,
} from "@nlux/react";

const demoProxyServerUrl = "/api/chat";

function chatHistoryMessageInSingleString(
  chatHistory: (ChatItem<string[]> | ChatItem<string>)[]
): ChatItem<string>[] {
  return chatHistory.map((m) => {
    return {
      role: m.role,
      message: typeof m.message === "string" ? m.message : m.message.join(""),
    };
  });
}

// Adapter to send query to the server and receive a stream of chunks as response
export const openAiAdapter: () => ChatAdapter = () => ({
  streamText: async (
    prompt: string,
    observer: StreamingAdapterObserver,
    extras: ChatAdapterExtras
  ) => {
    const body = {
      prompt,
      messages: clipChatMessagesUpToNTokens(
        chatHistoryMessageInSingleString(extras.conversationHistory || []),
        200
      ).map((m) => ({ role: m.role, content: m.message })),
    };
    const response = await fetch(demoProxyServerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.status !== 200) {
      observer.error(new Error("Failed to connect to the server"));
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
      const { value, done } = await reader.read();
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
