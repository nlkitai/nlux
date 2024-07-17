# Overview

## Layers

`NLUX` is a highly customizable and fully featured conversational AI UI library with 3 layers

* **[The User Interface Layer](/reference/ui)** 🎨 — Which is responsible for `everything that gets rendered on the
  screen`, such as the user and the AI messages, and the composer. It also provides event listeners, hooks, 
  and primitives.
* **[The API Layer](/reference/api)** 📡 — Which provides `APIs to interact with the chatbot` programmatically,
  and enables operations such as sending messages, getting the chat history, and more.
* **[The Adapters Layer](/learn/adapters)** 🔌 — Which enables the `integration with AI backends` by handling API calls,
  response streaming, and more. It also allows for `custom adapters` to be built for any backend.

## Platforms

The core `NLUX` library is available in 2 flavors:

* **`NLUX` React JS** ⚛️ — React JS implementation using the React rendering engine, components, and hooks.
* **`NLUX` JavaScript** 🟨 — Pure JavaScript library that can be used with any web framework (such as Vue) or with plain HTML.

As per the compatibility with other frameworks:

* **`Next.js` Integration:** All the `React JS` features have been developed and tested with the `Next.js` as a primary use-case.
* **Non-React Frameworks Integration:** The vanilla `JavaScript` library can be used with any non-React framework or library,
such as `Vue.js`, `Angular`, or `Svelte`. Or even with plain HTML and JavaScript.

You'll find a toggle at the top of each documentation page that allows switching between the 2 platforms. 
