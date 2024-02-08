import {warnOnce} from '@nlux/core';
import {OpenAiAdapterBuilder} from './openai/gpt/builders/builder';
import {OpenAiAdapterBuilderImpl} from './openai/gpt/builders/builderImpl';

export const createUnsafeAdapter = (): OpenAiAdapterBuilder => {
    warnOnce('You just have created an OpenAI adapter that connects to the API directly from the browser. '
        + 'This is not recommended for production use. We recommend that you implement a server-side proxy and configure '
        + 'a customized adapter for it. To learn more about how to create custom adapters for NLUX, visit:\n'
        + 'https://nlux.dev/learn/adapters/custom-adapters');

    return new OpenAiAdapterBuilderImpl();
};

export const createAdapter = (): OpenAiAdapterBuilder => {
    warnOnce('@nlux/openai-react -> createAdapter() is deprecated. You can either use createUnsafeAdapter() or '
        + 'create a custom adapter by implementing the Adapter interface. To learn more about how to create '
        + 'custom adapters for NLUX, visit:\n'
        + 'https://nlux.dev/learn/adapters/custom-adapters');

    return createUnsafeAdapter();
};
