# [nlux JS](https://nlux.ai) 🌲✨💬

![Free And Open Source](https://img.shields.io/badge/Free%20%26%20Open%20Source-1ccb61)
[![Docs nlux.ai](https://img.shields.io/badge/Docs_Website-nlux.dev-fa896b)](https://nlux.dev)

## The Conversational AI UI Library For Any LLM

`nlux` _(for Natural Language User Experience)_ is an open-source Javascript library that makes it super simple to
integrate powerful large language models (LLMs) like ChatGPT into your web app or website. With just a few lines
of code, you can add conversational AI capabilities and interact with your favourite LLM.

## Key Features 🌟

* **Build AI Chat Interfaces In Minutes** ― High quality conversational AI interfaces with just a few lines of code.
* **LLM Adapters** ― For `ChatGPT` / `LangChain` 🦜 LangServe / `HuggingFace` 🤗 Inference.
* A flexible interface to **Create Your Own Adapter** for any LLM or API.
* **Bot and User Personas** ― Customize the bot and user personas with names, images, and more.
* **Streaming LLM Output** ― Stream the chat response to the UI as it's being generated.
* **Customizable Theme** - Easily customize the look and feel of the chat interface using CSS variables.
* **Event Listeners** - Listen to messages, errors, and other events to customize the UI and behaviour.
* **Zero Dependencies** ― Lightweight codebase, with zero-dep except for LLM front-end libraries.

[![200+ Unit Tests](https://github.com/nluxai/nlux/actions/workflows/run-all-tests.yml/badge.svg)](https://github.com/nluxai/nlux/actions/workflows/run-all-tests.yml)

## Docs & Examples 📖

* Developer portal ― [nlux.dev](https://nlux.dev/)
* Examples and live code playgrounds ― [nlux.dev/examples](https://nlux.dev/examples)
* [Standard LLM adapters available](https://nlux.dev/learn/adapters)
* [How to create your own adapter for nlux](https://nlux.dev/learn/adapters/custom-adapters/create-custom-adapter)

## Vanilla JS 🟨 vs React JS ⚛️

This package `@nlux/core` is the vanilla JS version of the library.
If you're looking for the React JS version, please check
the [`@nlux/react`](https://www.npmjs.com/package/@nlux/react) package.

## Get Started With `nlux JS` 🚀

The example below demonstrates how to create an AI chat interface using `nlux JS` and LangChain, the open source
framework for building LLM backends. But you can use `nlux` **with any LLM** ― either
via the [standard adapters](https://nlux.dev/learn/adapters) provided, or
by creating [your own adapter](https://nlux.dev/learn/adapters/custom-adapters/create-custom-adapter).

To get started with `nlux JS` and `LangChain`, install the `@nlux/core` and `@nlux/langchain` packages:

```sh
npm install @nlux/core @nlux/langchain
```

Configure the LangChain LangServe adapter to connect to your API endpoint:

```js
import {createAiChat} from '@nlux/core';
import {createChatAdapter} from '@nlux/langchain';

const langChainAdapter = createChatAdapter().withUrl('https://<Your LangServe Runnable URL>');
```

Then render the `AiChat` component into your web page:

```js
const aiChat = createAiChat()
    .withAdapter(langChainAdapter)
    .withConversationOptions({
        historyPayloadSize: 'max'
    })
    .withPromptBoxOptions({
        placeholder: 'How can I help you today?'
    })

aiChat.mount(document.getElementById('root'));
```

You should also [include the nlux theme CSS file](#theme-file-and-css-) in your HTML page.

## And The Result Is ✨

An AI chatbot, powered by LangChain, that can understand and respond to user messages:

[![nlux AiChat Component](https://nlux.ai/images/demos/chat-convo-demo-fin-advisor.gif)](https://nlux.ai)

## Theme File and CSS 🎨

You should include a **theme CSS file** into your HTML page.<br />
You can download and host the `Nova Theme` CSS file
from [`@nlux/themes`](https://www.npmjs.com/package/@nlux/themes) or use the
CDN hosted version from below:

```jsx
<link rel="stylesheet" href="https://themes.nlux.ai/v1.0.5/nova.css"/>
```

This CDN is provided for demo purposes only and it's not scalable.
Please download and host the theme files on your own for production use.
