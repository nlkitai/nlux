# nlux React OpenAI Adapter

[![Free And Open Source](https://img.shields.io/badge/Free%20%26%20Open%20Source-%2348c342)](https://github.com/nluxai/nlux) [![Docs nlux.ai](https://img.shields.io/badge/Docs_Website-nlux.dev-%23fa896b)](https://nlux.dev)

This package enables the integration between nlux and OpenAI's API.  
More specifically ― the package include the adapter to connect to text generation models exposed
via [OpenAI Text Generation APIs](https://platform.openai.com/docs/guides/text-generation).

Please note: This adapter connects to the OpenAI API directly from the browser and requires an API key
to be used from a web page. It's not recommended to use it in production environments, and it should only
be used for development and testing purposes.

If you would like to use OpenAI's API in a production environment, you should use the OpenAI API from a server
(such us a simple Node.js proxy server that you build) and then connect to it from your web page. You can use
nlux with any API or LLM by **creating a custom adapter for it**.

For more information on how to use this package, please visit:  
[https://docs.nlux.ai/api/adapters/open-ai](https://docs.nlux.ai/api/adapters/open-ai)

For more information on how to create custom adapters for your own LLM or API, please visit:  
[https://docs.nlux.ai/learn/adapters/custom-adapters/create-custom-adapter](https://docs.nlux.ai/learn/adapters/custom-adapters/create-custom-adapter)

### Vanilla JS 🟨 vs React JS ⚛️

This package `@nlux/openai-react` is meant for use with the React JS version of nlux.
If you're looking for the vanilla JS version, please check
the [`@nlux/openai`](https://www.npmjs.com/package/@nlux/openai) package.

## About nlux

nlux _(for Natural Language User Experience)_ is an open-source Javascript library that makes it simple to integrate
powerful large language models (LLMs) like ChatGPT into your web app or website. With just a few lines of code, you
can add conversational AI capabilities and interact with your favourite LLM.

### Key Features 🌟

* **Build AI Chat Interfaces In Minutes** ― High quality conversational AI interfaces with just a few lines of code.
* **React Components & Hooks** ― `<AiChat />` for UI and `useChatAdapter` hook for easy integration.
* **LLM Adapters** ― For `ChatGPT` / `LangChain` 🦜 LangServe / `HuggingFace` 🤗 Inference.
* A flexible interface to **Create Your Own Adapter** for any LLM or API.
* **Bot and User Personas** ― Customize the bot and user personas with names, images, and more.
* **Streaming LLM Output** ― Stream the chat response to the UI as it's being generated.
* **Customizable Theme** - Easily customize the look and feel of the chat interface using CSS variables.
* **Event Listeners** - Listen to messages, errors, and other events to customize the UI and behaviour.
* **Zero Dependencies** ― Lightweight codebase, with zero-dep except for LLM front-end libraries.

[![200+ Unit Tests](https://github.com/nluxai/nlux/actions/workflows/run-all-tests.yml/badge.svg)](https://github.com/nluxai/nlux/actions/workflows/run-all-tests.yml)

### Docs & Examples 📖

For developer documentation, examples, and API reference ― you can visit: **[nlux.ai](https://nlux.ai/)**
