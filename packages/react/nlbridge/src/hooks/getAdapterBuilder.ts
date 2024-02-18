import {createAdapter, NlBridgeAdapterBuilder, NlBridgeAdapterOptions} from '@nlux/nlbridge';

const source = 'hooks/getAdapterBuilder';

export const getAdapterBuilder = (options: NlBridgeAdapterOptions): NlBridgeAdapterBuilder => {
    const {
        url,
        dataTransferMode,
    } = options || {};

    if (dataTransferMode && dataTransferMode !== 'stream' && dataTransferMode !== 'fetch') {
        throw new Error(`Data transfer mode not supported`);
    }

    if (!url) {
        throw new Error(`Runnable URL is required`);
    }

    let newAdapter = createAdapter().withUrl(url);

    if (dataTransferMode) {
        newAdapter = newAdapter.withDataTransferMode(dataTransferMode);
    }

    return newAdapter;
};
