import {ChatAdapterBuilder, ChatAdapterOptions} from '@nlux/hf';
import {useEffect, useState} from 'react';
import {debug} from '../../../../shared/src/utils/debug';
import {initChatAdapter} from './initChatAdapter';

const source = 'hooks/useChatAdapter';

export const useChatAdapter = (options: ChatAdapterOptions) => {
    if (!options.model) {
        throw new Error('You must provide either a model or an endpoint to use Hugging Face Inference API.');
    }

    const [isInitialized, setIsInitialized] = useState(false);
    const [adapter] = useState<ChatAdapterBuilder>(
        initChatAdapter(options),
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
            message: 'A new parameter has changed in useChatAdapter(). Adapter cannot be changed after ' +
                'initialization and the new parameter will not be applied. Please re-initialize the adapter ' +
                'with the new parameter. or user adapter methods to change the options and behaviour of ' +
                'the adapter.',
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
