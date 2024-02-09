# [NLUX JS](https://nlux.ai) 🌲✨💬

[![Free And Open Source](https://img.shields.io/badge/Free%20%26%20Open%20Source-%2348c342)](https://github.com/nluxai/nlux) [![Docs NLUX.ai](https://img.shields.io/badge/Docs_Website-NLUX.dev-%23fa896b)](https://nlux.dev)

## The Conversational AI UI Library For Any LLM

NLUX _(for Natural Language User Experience)_ is an open-source Javascript library that makes it simple to integrate
powerful large language models (LLMs) like ChatGPT into your web app or website. With just a few lines of code, you
can add conversational AI capabilities and interact with your favourite LLM.

## Key Features 🌟

* **Build AI Chat Interfaces In Minutes** ― High quality conversational AI interfaces with just a few lines of code.
* **LLM Adapters** ― For `ChatGPT` / `LangChain` 🦜 LangServe / `HuggingFace` 🤗 Inference.
* A flexible interface to **Create Your Own Adapter** for any LLM or API.
* **Bot and User Personas** ― Customize the bot and user personas with names, images, and more.
* **Streaming LLM Output** ― Stream the chat response to the UI as it's being generated.
* **Customizable Theme** - Easily customize the look and feel of the chat interface using CSS variables.
* **Event Listeners** - Listen to messages, errors, and other events to customize the UI and behaviour.
* **Zero Dependencies** ― Lightweight codebase, with zero-dep except for LLM front-end libraries.

## Docs & Examples 📖

For developer documentation, examples, and API reference ― you can visit: **[NLUX.ai](https://nlux.ai/)**

## Vanilla JS 🟨 vs React JS ⚛️

This package `@nlux/core` is the vanilla JS version of NLUX.
If you're looking for the React JS version, please check
the [`@nlux/react`](https://www.npmjs.com/package/@nlux/react) package.

## Get Started With NLUX and ChatGPT 🚀

To get started with NLUX JS and ChatGPT, install the `@nlux/core` and `@nlux/openai` packages:

```sh
npm install @nlux/core @nlux/openai
```

Configure the OpenAI adapter with your API key:<br />
_(You can [get an API key](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key) from your
OpenAI dashboard)_

```js
import {createAiChat} from '@nlux/core';
import {createAdapter} from '@nlux/openai';

const chatGptAdapter = createAdapter()
    .withApiKey('YOUR_OPEN_AI_API_KEY')
    // 👇 Instruct ChatGPT how to behave (optional)
    .withSystemMessage(
        'Give sound, tailored financial advice. Explain concepts simply. When unsure, ask questions. ' +
        'Only recommend legal, ethical practices. Be friendly. Write concise answers under 5 sentences.'
    );
```

Then render the `AiChat` component into your web page:

```js
const aiChat = createAiChat()
    .withAdapter(chatGptAdapter)
    .withConversationOptions({
        scrollWhenGenerating: true,
    })
    .withPromptBoxOptions({placeholder: 'How can I help you today?'})

aiChat.mount(document.getElementById('root'));
```

You should also [include the NLUX theme CSS file](#theme-file-and-css-) in your HTML page.

## And The Result Is ✨

An AI chatbot, experienced in personal finance, that can give your users sound, tailored financial advice:

[![NLUX AiChat Component](https://nlux.ai/images/demos/chat-convo-demo-fin-advisor.gif)](https://nlux.ai)

## Theme File and CSS 🎨

You should include a **theme CSS file** into your HTML page.<br />
You can download and host the `Nova Theme` CSS file
from [`@nlux/themes`](https://www.npmjs.com/package/@nlux/themes) or use the
CDN hosted version from below:

```jsx
<link rel="stylesheet" href="https://themes.nlux.ai/v0.10.11/nova.css"/>
```

This CDN is provided for demo purposes only and it's not scalable.
Please download and host the theme files on your own for production use.
