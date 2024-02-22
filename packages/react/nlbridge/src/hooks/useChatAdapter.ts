import {AiTaskRunner, ChatAdapterBuilder} from '@nlux/nlbridge';
import {AiContext, AiContextData} from '@nlux/react';
import {useContext, useEffect, useState} from 'react';
import {getChatAdapterBuilder} from './getChatAdapterBuilder';

export type ReactChatAdapterOptions = {
    url: string;
    dataTransferMode?: 'stream' | 'fetch';
    context?: AiContext;
};

const getTaskRunner = (contextData?: AiContextData): AiTaskRunner | undefined => {
    if (!contextData) {
        return;
    }

    return (taskId: string, parameters: any[]) => {
        const callback = contextData.registeredTaskCallbacks[taskId];
        if (callback) {
            return callback(...parameters);
        }
    };
};

export const useChatAdapter = (options: ReactChatAdapterOptions) => {
    const {context, url, dataTransferMode} = options || {};
    const contextData = context ? useContext(context.ref) : undefined;
    const [isInitialized, setIsInitialized] = useState(false);
    const [adapterBuilder, setAdapter] = useState<ChatAdapterBuilder>(
        getChatAdapterBuilder({
            ...options,
            taskRunner: getTaskRunner(contextData),
        }),
    );

    useEffect(() => {
        if (!isInitialized) {
            setIsInitialized(true);
            return;
        }

        let newAdapterBuilder = getChatAdapterBuilder({
            url,
            dataTransferMode,
            contextId: contextData?.contextId,
            taskRunner: getTaskRunner(contextData),
        });

        setAdapter(newAdapterBuilder);
    }, [
        isInitialized,
        contextData,
        dataTransferMode,
        url,
    ]);

    return adapterBuilder;
};
