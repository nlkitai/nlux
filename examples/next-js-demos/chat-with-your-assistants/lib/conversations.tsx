"use client";
import { Conversation } from "@/data/history";
import { ChatItem } from "@nlux/react";

export function sortConversationsByLastMessageDate(
  conversations: Conversation[]
): Conversation[] {
  const clone = conversations.slice();
  return clone.sort((a, b) => {
    const lastTimestampA = getConversationLastTimestamp(a);
    const lastTimestampB = getConversationLastTimestamp(b);
    // Handle the case where both conversations have no messages
    if (!lastTimestampA && !lastTimestampB) {
      return 0;
    }
    // Handle the case where only one conversation has no messages
    if (!lastTimestampA) {
      return 1;
    }
    if (!lastTimestampB) {
      return -1;
    }
    return lastTimestampB?.getTime() - lastTimestampA?.getTime();
  });
}
export function getConversationLastTimestamp(
  conversation: Conversation
): Date | undefined {
  return conversation.chat?.findLast((item) => item.message)?.timestamp;
}

export function charCountToTokens(charCount: number): number {
  return Math.ceil(charCount / 4);
}

export function clipChatMessagesUpToNTokens(
  chatItems: ChatItem[],
  maxTokens: number
): ChatItem[] {
  let totalTokens = 0;
  let clippedItems = chatItems.slice();
  for (let i = chatItems.length - 1; i >= 0; i--) {
    const item = chatItems[i];
    totalTokens += charCountToTokens(item.message.length);
    if (totalTokens > maxTokens) {
      clippedItems = chatItems.slice(i + 1);
      break;
    }
  }
  return clippedItems;
}
export function parsedToObjects(parsed: Conversation[]): Conversation[] {
  return parsed.map((conversation: Conversation) => {
    return {
      ...conversation,
      chat: conversation.chat?.map((item) => {
        return {
          ...item,
          timestamp:
            typeof item.timestamp === "string"
              ? new Date(item.timestamp)
              : item.timestamp,
        };
      }),
    };
  });
}
