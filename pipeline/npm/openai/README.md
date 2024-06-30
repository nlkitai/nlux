# NLUX JS OpenAI Adapter

![Free And Open Source](https://img.shields.io/badge/Free%20%26%20Open%20Source-1ccb61)
[![Docs https://docs.nlkit.com/nlux](https://img.shields.io/badge/Docs_Website-docs.nlkit.com/nlux-fa896b)](https://docs.nlkit.com/nlux)

This package enables the integration between NLUX and OpenAI's API.  
More specifically ― the package include the adapter to connect to text generation models exposed
via [OpenAI Text Generation APIs](https://platform.openai.com/docs/guides/text-generation).

Please note: This adapter connects to the OpenAI API directly from the browser and requires an API key
to be used from a web page. It's not recommended to use it in production environments, and it should only
be used for development and testing purposes.

If you would like to use OpenAI's API in a production environment, you should use the OpenAI API from a server
(such us a simple Node.js proxy server that you build) and then connect to it from your web page. You can use
NLUX with any API or LLM by **creating a custom adapter for it**.

For more information on how to use this package, please visit:  
[https://docs.nlkit.com/nlux/reference/adapters/open-ai](https://docs.nlkit.com/nlux/reference/adapters/open-ai)

For more information on how to create custom adapters for your own LLM or API, please visit:  
[https://docs.nlkit.com/nlux/learn/adapters/custom-adapters/create-custom-adapter](https://docs.nlkit.com/nlux/learn/adapters/custom-adapters/create-custom-adapter)

## Vanilla JS 🟨 vs React JS ⚛️

This package `@nlux/openai` is meant for use with the vanilla JS version of NLUX.
If you're looking for the React JS version, please check
the [`@nlux/openai-react`](https://www.npmjs.com/package/@nlux/openai-react) package.

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

[![200+ Unit Tests](https://github.com/nlkitai/nlux/actions/workflows/run-all-tests.yml/badge.svg)](https://github.com/nlkitai/nlux/actions/workflows/run-all-tests.yml)

### Docs & Examples 📖

For developer documentation, examples, and API reference ― you can visit: **[docs.nlkit.com/nlux](https://docs.nlkit.com/nlux)**
