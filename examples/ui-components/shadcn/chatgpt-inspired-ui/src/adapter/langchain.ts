import { createChatAdapter } from "@nlux/langchain-react";

// A simple adapter that connects to a LangChain LangServe demo API
// created by NLUX
export const langChainAdapter = () => createChatAdapter()
    .withUrl("https://pynlux.api.nlkit.com/pirate-speak")
    .create();

// If you are looking to build your own AI endpoint, you can check the Getting Started guides on NLUX
// that explain how to integrate with Next.js, Node.js, LangServe, and other frameworks.
// https://docs.nlkit.com/nlux/learn/get-started/
