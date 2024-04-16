import {ChatAdapterBuilder, ChatAdapterOptions} from '@nlux/openai';
import {useEffect, useState} from 'react';
import {getAdapterBuilder} from './getAdapterBuilder';

const source = 'hooks/useUnsafeChatAdapter';

export const useUnsafeChatAdapter = <MessageType>(options: ChatAdapterOptions) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [adapter, setAdapter] = useState<ChatAdapterBuilder<MessageType>>(
        getAdapterBuilder<MessageType>(options),
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

        const newAdapter = getAdapterBuilder<MessageType>(options);
        setAdapter(newAdapter);
    }, [
        apiKey,
        dataTransferMode,
        systemMessage,
        model,
    ]);

    return adapter;
};
