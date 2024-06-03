import {ChatAdapterOptions, StandardChatAdapter} from '@nlux/langchain';
import {useDeepCompareEffect} from '@nlux/react';
import {useState} from 'react';
import {getAdapterBuilder} from './getAdapterBuilder';

export const useChatAdapter = <AiMsg = string>(
    options: ChatAdapterOptions<AiMsg>,
): StandardChatAdapter<AiMsg> => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [adapter, setAdapter] = useState<
        StandardChatAdapter<AiMsg>
    >(
        getAdapterBuilder<AiMsg>(options).create(),
    );

    const {
        url,
        dataTransferMode,
        headers,
        config,
        inputPreProcessor,
        outputPreProcessor,
        useInputSchema,
    } = options || {};

    useDeepCompareEffect(() => {
        if (!isInitialized) {
            setIsInitialized(true);
            return;
        }

        const newAdapter = getAdapterBuilder<AiMsg>(options).create();
        setAdapter(newAdapter);
    }, [
        isInitialized,
        url,
        dataTransferMode,
        headers || {},
        config || {},
        inputPreProcessor,
        outputPreProcessor,
        useInputSchema,
    ]);

    return adapter;
};
