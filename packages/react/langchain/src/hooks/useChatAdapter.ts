import {ChatAdapterBuilder, ChatAdapterOptions} from '@nlux/langchain';
import {useDeepCompareEffect} from '@nlux/react';
import {useState} from 'react';
import {getAdapterBuilder} from './getAdapterBuilder';

export const useChatAdapter = <AiMsg = string>(options: ChatAdapterOptions<AiMsg>) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [adapter, setAdapter] = useState<ChatAdapterBuilder<AiMsg>>(
        getAdapterBuilder<AiMsg>(options),
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
