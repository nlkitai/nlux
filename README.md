# NLUX

[![npm version](https://badge.fury.io/js/@nlux%2Fnlux.svg)](https://badge.fury.io/js/@nlux%2Fnlux)
[![GitHub license](https://img.shields.io/badge/license-MPL%822.0-blue.svg)](https://raw.githubusercontent.com/nlux/nlux-js/master/LICENSE)

## The JS / React Library For Building Conversational AI Interfaces ✨💬

NLUX _(for Natural Language User Experience)_ is an open-source Javascript library that makes it simple to integrate
powerful large language models (LLMs) like ChatGPT into your web app or website. With just a few lines of code, you
can add conversational AI capabilities and interact with your favourite LLM.

## Key Features 🌟

* **Build AI Chat Interfaces In Minutes** - High quality conversational AI interfaces with just a few lines of code.
* **React Components & Hooks** - `<AiChat />` for UI and `useAdapter` hook for easy integration.
* **Flexible LLM Adapters** - `ChatGPT` and `HuggingFace`, and an API to **Create Your Own Adapter** for any LLM.
* **Bot and User Personas** - Customize the bot and user personas with names, images, and descriptions.
* **Streaming LLM Output** - Streamed the chat response to the UI as it's being generated.
* **Syntax Highlighting** - Color code snippets in the response. **Copy And Paste** code into your editor.
* **Personalized Conversation** - Provide context using system messages, and instruct LLM how to behave.
* **Customizable Theme** - Easily customize the look and feel of the chat interface using CSS variables.
* **Event Listeners** - Listen to messages, errors, and other events to customize the UI and behaviour.
* **Zero Dependencies** - Lightweight codebase, with zero-dependencies except for LLM front-end libraries.

## Repo Content 📦

This GitHub repository contains the source code for the NLUX library.<br />
It is a monorepo that contains the following NPM packages:

**React JS Packages:**

* [`@nlux/react`](https://www.npmjs.com/package/@nlux/react) - React JS components for NLUX.
* [`@nlux/openai-react`](https://www.npmjs.com/package/@nlux/openai-react) - React hooks for the OpenAI API.
* [`@nlux/hf-react`](https://www.npmjs.com/package/@nlux/hf-react) - React hooks and pre-processors for the Hugging Face
  Inference API

**Vanilla JS Packages:**

* [`@nlux/core`](https://www.npmjs.com/package/@nlux/core) - The core Vanilla JS library to use with any web framework.
* [`@nlux/openai`](https://www.npmjs.com/package/@nlux/openai) - Adapter for the OpenAI API.
* [`@nlux/hf`](https://www.npmjs.com/package/@nlux/hf) - Adapter and pre-processors for the Hugging Face Inference API.

**Other Packages:**

* [`@nlux/themes`](https://www.npmjs.com/package/@nlux/themes) - Themes and CSS styles.
* [`@nlux/highlighter`](https://www.npmjs.com/package/@nlux/highlighter) - Syntax highlighter based on
  [Highlight.js](https://highlightjs.org/).

Please visit each package's NPM page for information on how to use it.

## Docs Website And Examples 📖

Please visit [docs.nlux.ai](https://docs.nlux.ai/) for the full documentation and examples.

## Design principles ⚜️

The following design principles guide the development of NLUX:

* **Natural**: The library should be as natural as possible. It should be easy to
  use and understand. The user experience should be intuitive and pleasant.
  No teaching or thinking should be required to use the library.

* **Fast**: The library should be as fast as possible. It should be fast to
  load, fast to render, fast to update, fast to respond to user input.
  To achieve that, we should avoid unnecessary work, optimize the code for performance,
  prefer native implementations where possible, and minimize bundle size.

* **Modular**: The library should be built with modularity and reusability in mind.
  We should break the UI into separate reusable components that can be combined to
  build various applications. This allows for more flexibility and customization.

* **Lightweight**: The library should be as lightweight as possible. It should
  not require any dependencies, language features, special build tools.

* **Accessible** - The library should be accessible to everyone. It should be
  usable by people with disabilities, on various devices, and in various
  environments.

## Mission 👨‍🚀

Our mission is **to enable developers to build outstanding LLM front-ends and apps**,
cross platforms, with a focus on performance and usability.

## Community and Support 🙏

* **Star The Repo** 🌟 - If you like NLUX, please star the repo to show your support.
* **[GitHub Discussions](https://github.com/nluxai/nlux/discussions)** - Ask questions, share ideas, and get help from
  the community.
* **[Docs Website](https://docs.nlux.ai/)** - To learn more about NLUX and contribute.

## License 📃

NLUX is licensed under the terms of the Mozilla Public License 2.0.<br />
Wondering what that means? Learn more on [MPL 2.0 FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/).

## About The Developer 👨‍💻

NLUX is a new open-source project that's being led by [Salmen Hichri](https://github.com/salmenus), a senior front-end
engineer based in London, with over a decade of experience building user interfaces and developer
tools at companies like Amazon and Goldman Sachs, and contributions to open-source projects.
