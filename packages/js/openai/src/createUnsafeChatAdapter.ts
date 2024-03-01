import {warnOnce} from '@nlux/core';
import {ChatAdapterBuilder} from './openai/gpt/builders/builder';
import {OpenAiAdapterBuilderImpl} from './openai/gpt/builders/builderImpl';

export const createUnsafeChatAdapter = (): ChatAdapterBuilder => {
    warnOnce('You just have created an OpenAI adapter that connects to the API directly from the browser. '
        + 'This is not recommended for production use. We recommend that you implement a server-side proxy and configure '
        + 'a customized adapter for it. To learn more about how to create custom adapters for nlux, visit:\n'
        + 'https://nlux.dev/learn/adapters/custom-adapters');

    return new OpenAiAdapterBuilderImpl();
};
