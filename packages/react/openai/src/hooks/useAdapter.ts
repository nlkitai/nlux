import {AdapterBuilder} from '@nlux/nlux';
import {useEffect, useState} from 'react';
import {warn} from '../x/debug.ts';
import {initAdapter} from './initAdapter.ts';

const source = 'hooks/useAdapter';

export const useAdapter = (adapterType: 'openai/gpt4', options: {
    apiKey: string;
    dataExchangeMode?: 'stream' | 'fetch';
    initialSystemMessage?: string;
}) => {
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
