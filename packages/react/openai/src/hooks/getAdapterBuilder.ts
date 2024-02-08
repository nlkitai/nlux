import {createUnsafeAdapter, OpenAiAdapterBuilder, OpenAiAdapterOptions} from '@nlux/openai';
import {NluxUsageError} from '@nlux/react';

const source = 'hooks/getAdapterBuilder';

export const getAdapterBuilder = (options: OpenAiAdapterOptions): OpenAiAdapterBuilder => {
    const {
        apiKey,
        dataTransferMode,
        systemMessage,
        model,
    } = options || {};

    if (dataTransferMode && dataTransferMode !== 'stream' && dataTransferMode !== 'fetch') {
        throw new NluxUsageError({
            source,
            message: 'Data transfer mode not supported',
        });
    }

    if (!apiKey) {
        throw new NluxUsageError({
            source,
            message: 'API key is required',
        });
    }

    let newAdapter = createUnsafeAdapter().withApiKey(apiKey);

    if (model !== undefined) {
        newAdapter = newAdapter.withModel(model);
    }

    if (dataTransferMode) {
        newAdapter = newAdapter.withDataTransferMode(dataTransferMode);
    }

    if (systemMessage) {
        newAdapter = newAdapter.withSystemMessage(systemMessage);
    }

    return newAdapter;
};
