# [NLUX](https://nlux.ai) 🌲✨💬

![Free And Open Source](https://img.shields.io/badge/Free%20%26%20Open%20Source-1ccb61)
[![npm version](https://img.shields.io/badge/NPM-@nlux/react-1ccb61)](https://www.npmjs.com/package/@nlux/react)
[![Docs NLUX.ai](https://img.shields.io/badge/Docs_Website-NLUX.dev-fa896b)](https://nlux.dev)

## The JS / React Library For Building Conversational AI Interfaces ✨💬

NLUX _(for Natural Language User Experience)_ is an open-source Javascript library that makes it super simple to
integrate
powerful large language models (LLMs) like ChatGPT into your web app or website. With just a few lines of code, you
can add conversational AI capabilities and interact with your favourite LLM.

## Key Features 🌟

* **Build AI Chat Interfaces In Minutes** ― High quality conversational AI interfaces with just a few lines of code.
* **React Components & Hooks** ― `<AiChat />` for UI and `useAdapter` hook for easy integration.
* **LLM Adapters** ― For `ChatGPT` ― `LangChain` 🦜 `LangServe` APIs ― `HuggingFace` 🤗 Inference.
* A flexible interface to **Create Your Own Adapter** for any LLM or API, with support for stream or fetch modes.
* **Bot and User Personas** ― Customize the bot and user personas with names, images, and descriptions.
* **Streaming LLM Output** ― Stream the chat response to the UI as it's being generated.
* **Zero Dependencies** ― Lightweight codebase, with zero-dependencies except for LLM front-end libraries.

[![200+ Unit Tests](https://github.com/nluxai/nlux/actions/workflows/run-all-tests.yml/badge.svg)](https://github.com/nluxai/nlux/actions/workflows/run-all-tests.yml)

## Repo Content 📦

This GitHub repository contains the source code for the NLUX library.<br />
It is a monorepo that contains the following NPM packages:

**React JS Packages:**

* [`@nlux/react`](https://www.npmjs.com/package/@nlux/react) ― React JS components for NLUX.
* [`@nlux/langchain-react`](https://www.npmjs.com/package/@nlux/langchain-react) ― React hooks and adapter for APIs
  created using LangChain's LangServe library.
* [`@nlux/openai-react`](https://www.npmjs.com/package/@nlux/openai-react) ― React hooks for the OpenAI API.
* [`@nlux/hf-react`](https://www.npmjs.com/package/@nlux/hf-react) ― React hooks and pre-processors for the Hugging Face
  Inference API

**Vanilla JS Packages:**

* [`@nlux/core`](https://www.npmjs.com/package/@nlux/core) ― The core Vanilla JS library to use with any web framework.
* [`@nlux/langchain`](https://www.npmjs.com/package/@nlux/langchain) ― Adapter for APIs created using LangChain's
  LangServe library.
* [`@nlux/openai`](https://www.npmjs.com/package/@nlux/openai) ― Adapter for the OpenAI API.
* [`@nlux/hf`](https://www.npmjs.com/package/@nlux/hf) ― Adapter and pre-processors for the Hugging Face Inference API.

**Themes & Extensions:**

* [`@nlux/themes`](https://www.npmjs.com/package/@nlux/themes) ― The default `Nova` theme and CSS styles.
* [`@nlux/markdown`](https://www.npmjs.com/package/@nlux/markdown) ― Markdown stream parser to render
  markdown as it's being generated.
* [`@nlux/highlighter`](https://www.npmjs.com/package/@nlux/highlighter) ― Syntax highlighter based on
  [Highlight.js](https://highlightjs.org/).

Please visit each package's NPM page for information on how to use it.

## Docs & Examples 🤩

* For developer documentation, examples, and API reference ― please visit: **[NLUX.dev](https://nlux.dev/)**

## Design Principles ⚜️

The following design principles guide the development of NLUX:

* **Intuitive** ― Interactions enabled by NLUX should be intuitive.
  Usage should unfold naturally without obstacles or friction. No teaching or thinking
  should be required to use UI built with NLUX.

* **Performance** ― NLUX should be as fast as possible. Fast to load, fast to render
  and update, fast to respond to user input. To achieve that, we should avoid unnecessary
  work, optimize for performance, minimize bundle size, and not depend on external libraries.

* **Accessibility** ― UI built with NLUX should be accessible to everyone. It should be usable
  by people with disabilities, on various devices, in various environments, and using various
  input methods (keyboard, touch, voice).

* **DX** ― NLUX recognizes developers as first-class citizens. The library should enable an
  optimal DX (developer experience). It should be effortless to use, easy to understand, and
  simple to extend. Stellar documentation should be provided. The feature roadmap should evolve
  aligning to developer needs voiced.

## Mission 👨‍🚀

Our mission is **to enable developers to build outstanding LLM front-ends and applications**,
cross platforms, with a focus on performance and usability.

## Community & Support 🙏

* **Star The Repo** 🌟 ― If you like NLUX, please star the repo to show your support.
* **[GitHub Discussions](https://github.com/nluxai/nlux/discussions)** ― Ask questions, report issues, and share your
  ideas with the community.
* **[Discord Community](https://discord.gg/VY4TDaf4)** ― Join our Discord server to chat with the community and get
  support.
* **[NLUX.dev](https://nlux.dev/)** Developers Website ― Examples, learning resources, and API reference.

## License 📃

NLUX is licensed under the terms of the Mozilla Public License 2.0.<br />
Wondering what that means? Learn more on [MPL 2.0 FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/).

## About The Developer 👨‍💻

NLUX is a new open-source project that's being led by [Salmen Hichri](https://github.com/salmenus), a senior front-end
engineer with over a decade of experience building user interfaces and developer
tools at companies like Amazon and Goldman Sachs, and contributions to open-source projects.
