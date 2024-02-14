import {warnOnce} from '@nlux/core';
import {OpenAiAdapterBuilder, OpenAiAdapterOptions} from '@nlux/openai';
import {useEffect, useState} from 'react';
import {getAdapterBuilder} from './getAdapterBuilder';

const source = 'hooks/useAdapter';

export const useUnsafeAdapter = (options: OpenAiAdapterOptions) => {
    warnOnce('You just have created an OpenAI adapter that connects to the API directly from the browser. '
        + 'This is not recommended for production use. We recommend that you implement a server-side proxy and '
        + 'configure a customized adapter for it. To learn more about how to create custom adapters for nlux, visit:\n'
        + 'https://nlux.dev/learn/adapters/custom-adapters');

    const [isInitialized, setIsInitialized] = useState(false);
    const [adapter, setAdapter] = useState<OpenAiAdapterBuilder>(
        getAdapterBuilder(options),
    );

    const {
        apiKey,
        dataTransferMode,
        systemMessage,
        model,
    } = options || {};

    useEffect(() => {
        if (!isInitialized) {
            setIsInitialized(true);
            return;
        }

        const newAdapter = getAdapterBuilder(options);
        setAdapter(newAdapter);
    }, [
        apiKey,
        dataTransferMode,
        systemMessage,
        model,
    ]);

    return adapter;
}

export const useAdapter = (options: OpenAiAdapterOptions) => {
    warnOnce('@nlux/openai-react -> useAdapter() is deprecated and will be removed in future versions. '
        + 'You can either call useUnsafeAdapter() or create a custom adapter by implementing the Adapter '
        + 'interface. To learn more about how to create custom adapters for nlux, visit\n'
        + 'https://nlux.dev/learn/adapters/custom-adapters');

    return useUnsafeAdapter(options);
};
