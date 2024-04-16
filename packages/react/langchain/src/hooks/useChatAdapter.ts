import {ChatAdapterBuilder, ChatAdapterOptions} from '@nlux/langchain';
import {useDeepCompareEffect} from '@nlux/react';
import {useState} from 'react';
import {getAdapterBuilder} from './getAdapterBuilder';

export const useChatAdapter = <MessageType>(options: ChatAdapterOptions<MessageType>) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [adapter, setAdapter] = useState<ChatAdapterBuilder<MessageType>>(
        getAdapterBuilder<MessageType>(options),
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
        headers || {},
        inputPreProcessor,
        outputPreProcessor,
        useInputSchema,
    ]);

    return adapter;
};
