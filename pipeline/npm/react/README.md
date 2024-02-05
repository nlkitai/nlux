# [NLUX REACT](https://nlux.ai) 🌲✨💬

[![Free And Open Source](https://img.shields.io/badge/Free%20%26%20Open%20Source-%2348c342)](https://github.com/nluxai/nlux) [![Docs NLUX.ai](https://img.shields.io/badge/Docs_Website-NLUX.dev-%23fa896b)](https://nlux.dev)

## The Conversational AI UI Library For Any LLM

NLUX _(for Natural Language User Experience)_ is an open-source Javascript library that makes it simple to integrate
powerful large language models (LLMs) like ChatGPT into your web app or website. With just a few lines of code, you
can add conversational AI capabilities and interact with your favourite LLM.

## Key Features 🌟

* **Build AI Chat Interfaces In Minutes** ― High quality conversational AI interfaces with just a few lines of code.
* **React Components & Hooks** ― `<AiChat />` for UI and `useAdapter` hook for easy integration.
* **LLM Adapters** ― For `ChatGPT` / `LangChain` 🦜 LangServe / `HuggingFace` 🤗 Inference.
* A flexible interface to **Create Your Own Adapter** for any LLM or API.
* **Bot and User Personas** ― Customize the bot and user personas with names, images, and more.
* **Streaming LLM Output** ― Streamed the chat response to the UI as it's being generated.
* **Customizable Theme** - Easily customize the look and feel of the chat interface using CSS variables.
* **Event Listeners** - Listen to messages, errors, and other events to customize the UI and behaviour.
* **Zero Dependencies** ― Lightweight codebase, with zero-dep except for LLM front-end libraries.

## Docs & Examples 📖

For developer documentation, examples, and API reference ― you can visit: **[NLUX.ai](https://nlux.ai/)**

## Get Started With NLUX React and ChatGPT 🚀

Install and import dependencies:

```sh
npm install @nlux/react @nlux/openai-react
```

Then include `<AiChat />` in your React app to get started.<br />
Use the `useAdapter` hook to configure an adapter for your LLM.

```jsx
import {AiChat} from '@nlux/react';
import {useAdapter} from '@nlux/openai-react';

const App = () => {
    const gptAdapter = useAdapter({
        apiKey: 'YOUR_OPEN_AI_API_KEY',
        // 👇 Instruct ChatGPT how to behave (optional)
        systemMessage:
            'Give sound, tailored financial advice. Explain concepts simply. When unsure, ask questions. ' +
            'Only recommend legal, ethical practices. Be friendly. Write concise answers under 5 sentences.'
    });

    return (
        <AiChat
            adapter={gptAdapter}
            promptBoxOptions={{
                placeholder: 'How can I help you today?'
            }}
        />
    );
}
```

You should also [include the NLUX theme CSS file](#theme-file-and-css-) in your HTML page
or import it in your React app.

## And The Result Is ✨

An AI chatbot, experienced in personal finance, that can give your users sound, tailored financial advice:

[![NLUX AiChat Component](https://nlux.ai/images/demos/chat-convo-demo-fin-advisor.gif)](https://nlux.ai)

## Theme File and CSS 🎨

You should include a **theme CSS file** into your HTML page.<br />
The recommended way for React developers is to install `@nlux/themes`

```sh
npm install @nlux/themes
```

Then import the theme CSS file into your app or component as follows:

```jsx
import '@nlux/themes/nova.css';
```

This requires that your bundler is configured to load CSS files.