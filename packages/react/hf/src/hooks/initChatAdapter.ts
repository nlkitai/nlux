import {ChatAdapterOptions, createChatAdapter} from '@nlux/hf';
import {NluxUsageError} from '@nlux/react';

const source = 'hooks/initChatAdapter';

export const initChatAdapter = (options: ChatAdapterOptions) => {
    const {
        model,
        authToken,
        dataTransferMode,
        preProcessors,
        maxNewTokens,
        systemMessage,
    } = options || {};

    if (dataTransferMode && dataTransferMode !== 'stream' && dataTransferMode !== 'fetch') {
        throw new NluxUsageError({
            source,
            message: 'Data transfer mode for Hugging Face Inference API must be either "stream" or "fetch"',
        });
    }

    if (model === undefined) {
        throw new NluxUsageError({
            source,
            message: 'You must provide either a model or an endpoint to use Hugging Face Inference API.',
        });
    }

    let newAdapter: any = createChatAdapter().withModel(model);

    if (authToken !== undefined) {
        newAdapter = newAdapter.withAuthToken(authToken);
    }

    if (dataTransferMode !== undefined) {
        newAdapter = newAdapter.withDataTransferMode(dataTransferMode);
    }

    if (preProcessors?.input !== undefined) {
        newAdapter = newAdapter.withInputPreProcessor(preProcessors?.input);
    }

    if (preProcessors?.output !== undefined) {
        newAdapter = newAdapter.withOutputPreProcessor(preProcessors?.output);
    }

    if (systemMessage !== undefined) {
        newAdapter = newAdapter.withSystemMessage(systemMessage);
    }

    if (maxNewTokens !== undefined) {
        newAdapter = newAdapter.withMaxNewTokens(maxNewTokens);
    }

    return newAdapter;
};
