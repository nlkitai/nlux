import {AdapterBuilder} from '@nlux/nlux';
import {useEffect, useState} from 'react';
import {OpenAIUseAdapterOptions} from '../types/options';
import {warn} from '../x/debug';
import {initAdapter} from './initAdapter';

const source = 'hooks/useAdapter';

export const useAdapter = (adapterType: 'openai/gpt', options: OpenAIUseAdapterOptions) => {
    const [adapter] = useState<AdapterBuilder<any, any>>(
        initAdapter(adapterType, options),
    );

    const {
        apiKey,
        dataExchangeMode,
        initialSystemMessage,
    } = options || {};

    useEffect(() => {
        warn({
            source,
            message: 'A new parameter has changed in useAdapter(). Adapter cannot be changed after initialization ' +
                'and the new parameter will not be applied. Please re-initialize the adapter with the new parameter. '
                + 'or user adapter methods to change the options and behaviour of the adapter.',
        });
    }, [
        adapterType,
        apiKey,
        dataExchangeMode,
        initialSystemMessage,
    ]);

    return adapter;
};
