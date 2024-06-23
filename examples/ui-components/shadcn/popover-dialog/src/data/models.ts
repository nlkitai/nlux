import { langChainAdapter } from "../adapter/langchain";
import { openAiAdapter } from "../adapter/openai";
import {ChatAdapter, StandardChatAdapter} from '@nlux/react';

export const models: {
  modelName: string;
  icon: string;
  adapter: () => ChatAdapter | StandardChatAdapter;
  description: string;
}[] = [
  {
    modelName: "GPT-4o",
    icon: "https://github.com/openai.png",
    adapter: openAiAdapter,
    description: "OpenAI fastest model for general use cases.",
  },
  {
    modelName: "LangChain Pirate Speak",
    icon: "https://github.com/langchain-ai.png",
    adapter: langChainAdapter,
    description: "AI that speaks like a pirate parrot, built with LangChain.",
  },
];
