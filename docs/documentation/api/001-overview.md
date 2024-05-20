# Overview

## Layers

The `NLUX` library consists of 2 layers:

* **[The User Interface Layer](/api/ui)** - Which is responsible for everything that gets rendered on the
  screen, such as
  the conversation component, the prompt input, the streaming of AI responses back to the user, and so on.
* **[The Adapters Layer](/learn/adapters)** - Which enables the integration with several backends, by handling API calls,
  and by
  offering a way to implement custom adapters as well.

## Platforms

`NLUX` is available in 2 flavors:

* **`NLUX` React JS** - Which is a React JS specific implementation that includes React components and hooks.
* **`NLUX` Javascript** - Which is the pure Javascript library that can be used with any web framework.

You'll find a toggle at the top of each documentation page that allows switching between the 2 platforms. 
