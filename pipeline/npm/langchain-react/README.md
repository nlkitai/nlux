# NLUX React LangChain Adapter

![Free And Open Source](https://img.shields.io/badge/Free%20%26%20Open%20Source-1ccb61)
[![Docs https://docs.nlkit.com/nlux](https://img.shields.io/badge/Docs_Website-docs.nlkit.com/nlux-fa896b)](https://docs.nlkit.com/nlux)

This package enables the integration between NLUX React and LangChain, the LLM framework.  
More specifically ― the package includes the adapter to connect **NLUX React** to backends built
using [LangServe](https://python.langchain.com/docs/langserve).

#### Features:

* Support for both `/invoke` and `/stream` endpoints to allow for responses to be streamed back as they are generated.
* Can utilize the `/input_schema` to construct a matching payload.
* Ability to customize the payloads, both sent and received.

For more information on how to use this package, please visit:
[docs.nlkit.com/nlux/reference/adapters/langchain-langserve](https://docs.nlkit.com/nlux/reference/adapters/langchain-langserve)

### Vanilla JS 🟨 vs React JS ⚛️

This package `@nlux/langchain-react` is meant for use with the React JS version of NLUX.
If you're looking for the vanilla JS version, please check
the [`@nlux/langchain`](https://www.npmjs.com/package/@nlux/langchain) package.

## About NLUX

NLUX _(for Natural Language User Experience)_ is an open-source JavaScript library that makes it simple to integrate
powerful large language models (LLMs) like ChatGPT into your web app or website. With just a few lines of code, you
can add conversational AI capabilities and interact with your favorite LLM.

### Key Features 🌟

* **Build AI Chat Interfaces In Minutes** ― High quality conversational AI interfaces with just a few lines of code.
* **React Components & Hooks** ― `<AiChat />` for UI and `useChatAdapter` hook for easy integration.
* **LLM Adapters** ― For `ChatGPT` / `LangChain` 🦜 LangServe / `HuggingFace` 🤗 Inference.
* A flexible interface to **Create Your Own Adapter** for any LLM or API.
* **Assistant and User Personas** ― Customize the assistant and user personas with names, images, and more.
* **Streaming LLM Output** ― Stream the chat response to the UI as it's being generated.
* **Customizable Theme** - Easily customize the look and feel of the chat interface using CSS variables.
* **Event Listeners** - Listen to messages, errors, and other events to customize the UI and behaviour.
* **Zero Dependencies** ― Lightweight codebase, with zero-dep except for LLM front-end libraries.

### Docs & Examples 📖

For developer documentation, examples, and API reference ― you can visit: **[docs.nlkit.com/nlux](https://docs.nlkit.com/nlux)**