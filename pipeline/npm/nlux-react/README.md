# NLUX REACT

## Build ChatGPT-powered Conversational AI UI ✨💬

NLUX _(for Natural Language User Experience)_ is an open-source Javascript library that makes it simple to integrate
powerful large language models (LLMs) like ChatGPT into your web app or website. With just a few lines of code, you
can add conversational AI capabilities and interact with your favourite LLM.

## Key Features 🌟

* **Build Custom ChatGPT Interfaces In Minutes** - Easily build chatbot and conversational interfaces with just a few
  lines of code.
* **React Components & Hooks** - `<NluxConvo />` for UI and `useAdapter` hook for easy integration.
* **Flexible LLM Adapters** - Provided adapters for `ChatGPT` and `HuggingFace` LLMs, and the ability to create
  your own custom adapters.
* **Zero Dependencies** - Lightweight codebase, with zero-dependencies except for LLM front-end libraries.
* **ChatGPT System Messages** - Instruct ChatGPT to "act as" a specific persona, give it more context,
  and get more personalized responses to all your prompts.
* **Streaming Responses** - The response will be streamed to the UI for a more natural conversation flow.

## Vanilla JS 🟨 vs React JS ⚛️

This package `@nlux/nlux-react` is the React JS version of NLUX.
If you're looking for the Vanilla JS version, please check out
the [`@nlux/nlux`](https://www.npmjs.com/package/@nlux/nlux) package.

## Get Started With NLUX React and ChatGPT 🚀

Install and import dependencies:

```sh
npm install @nlux/nlux-react @nlux/openai-react
```

Then include `<NluxConvo />` in your React app to get started.<br />
Use the `useAdapter` hook to configure an adapter for your LLM.

```jsx
import {NluxConvo} from '@nlux/nlux-react';
import {useAdapter} from '@nlux/openai-react';

const MyChatComp = () => {
    const gptAdapter = useAdapter({
        apiKey: 'YOUR_OPEN_AI_API_KEY',
        // 👇 Instruct ChatGPT how to behave (optional)
        systemMessage:
            'Act as a Nobel Prize in Physics winner who is ' +
            'helping a PHD student in their research'
    });

    return (
        <NluxConvo
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

[![Nlux Convo](https://nlux.ai/images/demos/chat-convo-nobel-prize-in-physics-winner.gif)](https://nlux.ai)

## Theme File and CSS 🎨

You should include a **theme CSS file** into your HTML page.<br />
You can download and host the `Kensington Theme` CSS file
from [`@nlux/themes`](https://www.npmjs.com/package/@nlux/themes) or use the
CDN hosted version from below:

```jsx
<link rel="stylesheet" href="https://themes.nlux.ai/v0.5.9/kensington.css"/>
```

This CDN is provided for demo purposes only and it's not scalable.
Please download and host the theme files on your own for production use.

In the context of React JS, you can directly `import '@nlux/themes/kensington.css'`
in your app/component, but please make sure that your bundler is configured to handle CSS files.