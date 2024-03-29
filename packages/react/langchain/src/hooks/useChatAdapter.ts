import {useDeepCompareEffect} from '@nlux/react';
import {ChatAdapterBuilder, ChatAdapterOptions} from '@nlux/langchain';
import {useState} from 'react';
import {getAdapterBuilder} from './getAdapterBuilder';

export const useChatAdapter = (options: ChatAdapterOptions) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [adapter, setAdapter] = useState<ChatAdapterBuilder>(
        getAdapterBuilder(options),
    );

    const {
        url,
        dataTransferMode,
        headers,
        inputPreProcessor,
        outputPreProcessor,
        useInputSchema,
    } = options || {};

    useDeepCompareEffect(() => {
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
        headers,
        inputPreProcessor,
        outputPreProcessor,
        useInputSchema,
    ]);

    return adapter;
};
