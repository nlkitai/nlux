import {NluxUsageError} from '@nlux/nlux';
import {createAdapter} from '@nlux/openai';

const source = 'hooks/initAdapter';

export const initAdapter = (adapterType: 'openai/gpt4', options: {
    apiKey: string;
    dataExchangeMode?: 'stream' | 'fetch';
    initialSystemMessage?: string;
}) => {
    const {
        apiKey,
        dataExchangeMode,
        initialSystemMessage,
    } = options || {};

    if (adapterType !== 'openai/gpt4') {
        throw new NluxUsageError({
            source,
            message: 'Adapter type not supported',
        });
    }

    if (dataExchangeMode && dataExchangeMode !== 'stream') {
        throw new NluxUsageError({
            source,
            message: 'Only streaming mode is supported at the moment',
        });
    }

    if (!apiKey) {
        throw new NluxUsageError({
            source,
            message: 'API key is required',
        });
    }

    let newAdapter: any = createAdapter(adapterType);
    if (typeof newAdapter.withApiKey !== 'function') {
        throw new NluxUsageError({
            source,
            message: 'Adapter does not support API key',
        });
    } else {
        newAdapter = newAdapter.withApiKey(apiKey);
    }

    if (dataExchangeMode === 'stream') {
        if (typeof newAdapter.useStreamingMode !== 'function') {
            throw new NluxUsageError({
                source,
                message: 'Adapter does not support streaming mode',
            });
        }

        newAdapter = newAdapter.useStreamingMode();
    }

    if (initialSystemMessage) {
        if (typeof newAdapter.withInitialSystemMessage !== 'function') {
            throw new NluxUsageError({
                source,
                message: 'Adapter does not support initial system message',
            });
        }

        newAdapter = newAdapter.withInitialSystemMessage(initialSystemMessage);
    }

    return newAdapter;
};
