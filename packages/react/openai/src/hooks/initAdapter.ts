import {NluxUsageError} from '@nlux/nlux';
import {createAdapter} from '@nlux/openai';
import {OpenAIUseAdapterOptions} from '../types/options';

const source = 'hooks/initAdapter';

export const initAdapter = (adapterType: 'openai/gpt', options: OpenAIUseAdapterOptions) => {
    const {
        apiKey,
        dataExchangeMode,
        initialSystemMessage,
        model,
    } = options || {};

    if (adapterType !== 'openai/gpt') {
        throw new NluxUsageError({
            source,
            message: 'Adapter type not supported',
        });
    }

    if (dataExchangeMode && dataExchangeMode !== 'stream' && dataExchangeMode !== 'fetch') {
        throw new NluxUsageError({
            source,
            message: 'Data exchange mode not supported',
        });
    }

    if (!apiKey) {
        throw new NluxUsageError({
            source,
            message: 'API key is required',
        });
    }

    let newAdapter: any = createAdapter(adapterType);

    if (model !== undefined) {
        if (typeof newAdapter.withModel !== 'function') {
            throw new NluxUsageError({
                source,
                message: 'Model provided as option but adapter does not support setting a model',
            });
        }

        newAdapter = newAdapter.withModel(model);
    }

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

    if (dataExchangeMode === 'fetch') {
        if (typeof newAdapter.useFetchingMode !== 'function') {
            throw new NluxUsageError({
                source,
                message: 'Adapter does not support fetch mode',
            });
        }

        newAdapter = newAdapter.useFetchingMode();
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
