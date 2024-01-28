import {OpenAiAdapterBuilder, OpenAiAdapterOptions} from '@nlux/openai';
import {useEffect, useState} from 'react';
import {getAdapterBuilder} from './getAdapterBuilder';

const source = 'hooks/useAdapter';

export const useAdapter = (options: OpenAiAdapterOptions) => {
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
};
