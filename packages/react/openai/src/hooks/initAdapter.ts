import {NluxUsageError} from '@nlux/nlux-react';
import {createAdapter, OpenAiAdapterOptions} from '@nlux/openai';

const source = 'hooks/initAdapter';

export const initAdapter = (options: OpenAiAdapterOptions) => {
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

    let newAdapter = createAdapter().withApiKey(apiKey);

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
