import {ChatAdapterOptions, StandardChatAdapter} from '@nlux/openai';
import {useEffect, useState} from 'react';
import {getAdapterBuilder} from './getAdapterBuilder';

export const useUnsafeChatAdapter = <AiMsg>(
    options: ChatAdapterOptions,
): StandardChatAdapter<AiMsg> => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [adapter, setAdapter] = useState<StandardChatAdapter<AiMsg>>(
        getAdapterBuilder<AiMsg>(options).create(),
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

        const newAdapter = getAdapterBuilder<AiMsg>(options).create();
        setAdapter(newAdapter);
    }, [
        apiKey,
        dataTransferMode,
        systemMessage,
        model,
    ]);

    return adapter;
};
