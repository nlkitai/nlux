import {debug, HfAdapterBuilder, HfAdapterOptions} from '@nlux/hf';
import {useEffect, useState} from 'react';
import {initAdapter} from './initAdapter';

const source = 'hooks/useAdapter';

export const useAdapter = (options: HfAdapterOptions) => {
    if (!options.model) {
        throw new Error('You must provide either a model or an endpoint to use Hugging Face Inference API.');
    }

    const [isInitialized, setIsInitialized] = useState(false);
    const [adapter] = useState<HfAdapterBuilder>(
        initAdapter(options),
    );

    const {
        authToken,
        dataTransferMode,
        model,
        systemMessage,
        preProcessors: {
            input: inputPreProcessor = undefined,
            output: outputPreProcessor = undefined,
        } = {},
        maxNewTokens,
    } = options || {};

    useEffect(() => {
        if (!isInitialized) {
            setIsInitialized(true);
            return;
        }

        debug({
            source,
            message: 'A new parameter has changed in useHfAdapter(). Adapter cannot be changed after initialization ' +
                'and the new parameter will not be applied. Please re-initialize the adapter with the new parameter. '
                + 'or user adapter methods to change the options and behaviour of the adapter.',
        });
    }, [
        authToken,
        dataTransferMode,
        model,
        systemMessage,
        inputPreProcessor,
        outputPreProcessor,
        maxNewTokens,
    ]);

    return adapter;
};
