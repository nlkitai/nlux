# NLUX JS ✨💬

## Conversational AI UI Library For ChatGPT And Other LLMs

NLUX _(for Natural Language User Experience)_ is an open-source Javascript library that makes it simple to integrate
powerful large language models (LLMs) like ChatGPT into your web app or website. With just a few lines of code, you
can add conversational AI capabilities and interact with your favourite LLM.

## Key Features 🌟

* **Build AI Chat Interfaces In Minutes** - High quality conversational AI interfaces with just a few lines of code.
* **Flexible LLM Adapters** - `ChatGPT` `HuggingFace` and an API to **Create Your Own Adapter** for any LLM.
* **Streaming LLM Output** - Streamed the chat response to the UI as it's being generated.
* **Syntax Highlighting** - Color code snippets in the response. **Copy And Paste** code into your editor.
* **Personalize The Conversation** - Provide context using system message, and instruct the LLM how to behave.
* **Zero Dependencies** - Lightweight codebase, with zero-dependencies except for LLM front-end libraries.

## Docs Website 📖

Please visit [docs.nlux.ai](https://docs.nlux.ai/) for the full documentation and examples.

## Vanilla JS 🟨 vs React JS ⚛️

This package `@nlux/core` is the Vanilla JS version of NLUX.
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
        'Act as a Nobel Prize in Physics winner who is ' +
        'helping a PHD student in their research. Write short answers. Be funny!'
    );
```

Then render the `AiChat` component into your web page:

```js
const aiChat = createAiChat()
    .withAdapter(chatGptAdapter)
    .withConversationOptions({
        scrollWhenGenerating: true,
    })
    .withPromptBoxOptions({placeholder: 'Ask me anything about nuclear physics!'});

aiChat.mount(document.getElementById('root'));
```

You should also [include the NLUX theme CSS file](#theme-file-and-css-) in your HTML page.

## And The Result Is ✨

A fully functional chatbot UI that can advise you on nuclear physics, coding, and even tell you a joke or two!

[![Nlux AiChat Component](https://nlux.ai/images/demos/chat-convo-nobel-prize-in-physics-winner.gif)](https://nlux.ai)

## Theme File and CSS 🎨

You should include a **theme CSS file** into your HTML page.<br />
You can download and host the `Kensington Theme` CSS file
from [`@nlux/themes`](https://www.npmjs.com/package/@nlux/themes) or use the
CDN hosted version from below:

```jsx
<link rel="stylesheet" href="https://themes.nlux.ai/v0.8.4/nova.css"/>
```

This CDN is provided for demo purposes only and it's not scalable.
Please download and host the theme files on your own for production use.
