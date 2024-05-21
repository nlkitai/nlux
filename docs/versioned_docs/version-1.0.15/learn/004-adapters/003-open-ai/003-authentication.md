---
sidebar_label: 'Authentication'
---

# Authentication & Security

To integrate `NLUX` with OpenAI's services, you first need to obtain an API key from OpenAI. This key acts as your unique
identifier and access token for using OpenAI's APIs, including ChatGPT.

## Do I need to pay to use OpenAI's APIs?

OpenAI offers a free tier for its API that only includes $5 in free credit which can be used during the first three
months of usage [[Ref pricing page here](https://openai.com/pricing)]. This free credit allows users to experiment with
various OpenAI services, including GPT-based models and possibly others, depending on their pricing and the credit's
applicability. But in practice, the free tier is not enough for most use cases, and you may have restrictions on the
number of requests you can make, or the models that you can use.

We recommend to use the paid tier, starting from $5 per month, which allows you to use the full power of OpenAI's APIs.

## How do I get my API key?

Here's how you can get your API key:

1. **Sign Up or Log In to OpenAI:** Visit [OpenAI's website](https://openai.com/) and sign up or log in to your account.
2. **Access the API Section:** Once logged in, navigate to [the API section](https://platform.openai.com/api-keys) in
   your dashboard.
3. Click **Create new secret key** to create a new API key.
4. **Copy the API key:** Once the key is created, copy it to your clipboard. You will need it in the next step.

## How do I use my API key with `NLUX`?

If you're using `NLUX` with React, you can use the `useUnsafeChatAdapter` hook to create an OpenAI adapter and pass your API key to
it:

```jsx
const chatGptAdapter = useUnsafeChatAdapter({apiKey: 'YOUR_OPEN_AI_API_KEY'});
```

With the Vanilla JS version of `NLUX`, you can create an OpenAI adapter like this:

```js
const chatGptAdapter = createUnsafeChatAdapter().withApiKey('YOUR_OPEN_AI_API_KEY');
```

## API Keys And Security

Your API key is a secret token that allows you to access OpenAI's APIs. You should never share your API key with anyone
else. If you suspect that your API key has been compromised, you can revoke it and create a new one in your dashboard.

:::warning
If you intend to use `NLUX`'s OpenAI adapter on a public website, **you should never store your API key in your
frontend code**. Instead, you should store it in your backend code and make the API calls from there. This is because
storing your API key in your frontend code exposes it to the public, which is a security risk.
:::

If you're building a custom backend that uses OpenAI's APIs, you can build a custom adapter for your backend and use it
with `NLUX`. You can find more information about building custom adapters in
the [Adapters section](/learn/adapters/custom-adapters).
