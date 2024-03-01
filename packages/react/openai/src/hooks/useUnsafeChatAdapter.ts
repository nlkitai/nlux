import {ChatAdapterBuilder, ChatAdapterOptions} from '@nlux/openai';
import {useEffect, useState} from 'react';
import {getAdapterBuilder} from './getAdapterBuilder';

const source = 'hooks/useUnsafeChatAdapter';

export const useUnsafeChatAdapter = (options: ChatAdapterOptions) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [adapter, setAdapter] = useState<ChatAdapterBuilder>(
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
