# NLUX REACT

## Conversational AI React JS Library For ChatGPT And Other LLMs ✨💬

NLUX _(for Natural Language User Experience)_ is an open-source Javascript library that makes it simple to integrate
powerful large language models (LLMs) like ChatGPT into your web app or website. With just a few lines of code, you
can add conversational AI capabilities and interact with your favourite LLM.

## Key Features 🌟

* **Build AI Chat Interfaces In Minutes** - High quality conversational AI interfaces with just a few lines of code.
* **React Components & Hooks** - `<AiChat />` for UI and `useAdapter` hook for easy integration.
* **Flexible LLM Adapters** - Provided adapters for `ChatGPT` and `HuggingFace`, and an API to create
  your own adapter.
* **Streaming LLM Output** - Streamed the chat response to the UI as it's being generated.
* **Syntax Highlighting** - Color and highlight code snippets in the response. **Copy and paste** code into your
  editor.
* **Personalize The Conversation** - Providing context using system message, and instruct the LLM how to behave.
* **Zero Dependencies** - Lightweight codebase, with zero-dependencies except for LLM front-end libraries.

## Vanilla JS 🟨 vs React JS ⚛️

This package `@nlux/react` is the React JS version of NLUX.
If you're looking for the Vanilla JS version, please check
the [`@nlux/core`](https://www.npmjs.com/package/@nlux/core) package.

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
            'Act as a Nobel Prize in Physics winner who is ' +
            'helping a PHD student in their research'
    });

    return (
        <AiChat
            adapter={gptAdapter}
            promptBoxOptions={{
                placeholder: 'Ask me anything about nuclear physics!'
            }}
        />
    );
}
```

You should also [include the NLUX theme CSS file](#theme-file-and-css-) in your HTML page
or import it in your React app.

## And The Result Is ✨

A fully functional chatbot UI that can advise you on nuclear physics, coding, and even tell you a joke or two!

[![NLUX AiChat Component](https://nlux.ai/images/demos/chat-convo-nobel-prize-in-physics-winner.gif)](https://nlux.ai)

## Theme File and CSS 🎨

You should include a **theme CSS file** into your HTML page.<br />
You can download and host the `Kensington Theme` CSS file
from [`@nlux/themes`](https://www.npmjs.com/package/@nlux/themes) or use the
CDN hosted version from below:

```jsx
<link rel="stylesheet" href="https://themes.nlux.ai/v0.8.0/kensington.css"/>
```

This CDN is provided for demo purposes only and it's not scalable.
Please download and host the theme files on your own for production use.

In the context of React JS, you can directly `import '@nlux/themes/kensington.css'`
in your app/component, but please make sure that your bundler is configured to handle CSS files.

## Docs Website 📖

Please visit [docs.nlux.ai](https://docs.nlux.ai/) for the full documentation and examples.
