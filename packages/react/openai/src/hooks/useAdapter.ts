import {debug, OpenAiAdapterBuilder, OpenAiAdapterOptions} from '@nlux/openai';
import {useEffect, useState} from 'react';
import {initAdapter} from './initAdapter';

const source = 'hooks/useAdapter';

export const useAdapter = (options: OpenAiAdapterOptions) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [adapter] = useState<OpenAiAdapterBuilder>(
        initAdapter(options),
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

        debug({
            source,
            message: 'A new parameter has changed in useAdapter(). Adapter cannot be changed after initialization ' +
                'and the new parameter will not be applied. Please re-initialize the adapter with the new parameter. '
                + 'or user adapter methods to change the options and behaviour of the adapter.',
        });
    }, [
        apiKey,
        dataTransferMode,
        systemMessage,
        model,
    ]);

    return adapter;
};
