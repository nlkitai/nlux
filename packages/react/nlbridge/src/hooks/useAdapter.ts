import {NlBridgeAdapterBuilder, NlBridgeAdapterOptions} from '@nlux/nlbridge';
import {useEffect, useState} from 'react';
import {getAdapterBuilder} from './getAdapterBuilder';

const source = 'hooks/useAdapter';

export const useAdapter = (options: NlBridgeAdapterOptions) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [adapter, setAdapter] = useState<NlBridgeAdapterBuilder>(
        getAdapterBuilder(options),
    );

    const {
        url,
        dataTransferMode,
    } = options || {};

    useEffect(() => {
        if (!isInitialized) {
            setIsInitialized(true);
            return;
        }

        const newAdapter = getAdapterBuilder(options);
        setAdapter(newAdapter);
    }, [
        url,
        dataTransferMode,
    ]);

    return adapter;
};
