import {ChatAdapterBuilder, ChatAdapterOptions} from '@nlux/langchain';
import {useEffect, useState} from 'react';
import {getAdapterBuilder} from './getAdapterBuilder';

export const useChatAdapter = (options: ChatAdapterOptions) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [adapter, setAdapter] = useState<ChatAdapterBuilder>(
        getAdapterBuilder(options),
    );

    const {
        url,
        dataTransferMode,
        inputPreProcessor,
        outputPreProcessor,
        useInputSchema,
    } = options || {};

    useEffect(() => {
        if (!isInitialized) {
            setIsInitialized(true);
            return;
        }

        const newAdapter = getAdapterBuilder(options);
        setAdapter(newAdapter);
    }, [
        isInitialized,
        url,
        dataTransferMode,
        inputPreProcessor,
        outputPreProcessor,
        useInputSchema,
    ]);

    return adapter;
};
