import {ChatAdapterBuilder, ChatAdapterOptions} from '@nlux/openai';
import {useEffect, useState} from 'react';
import {getAdapterBuilder} from './getAdapterBuilder';

export const useUnsafeChatAdapter = <AiMsg>(options: ChatAdapterOptions) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [adapter, setAdapter] = useState<ChatAdapterBuilder<AiMsg>>(
        getAdapterBuilder<AiMsg>(options),
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

        const newAdapter = getAdapterBuilder<AiMsg>(options);
        setAdapter(newAdapter);
    }, [
        apiKey,
        dataTransferMode,
        systemMessage,
        model,
    ]);

    return adapter;
};
