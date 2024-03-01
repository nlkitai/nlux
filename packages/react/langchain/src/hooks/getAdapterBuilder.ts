import {ChatAdapterBuilder, ChatAdapterOptions, createChatAdapter} from '@nlux/langchain';

const source = 'hooks/getAdapterBuilder';

export const getAdapterBuilder = (options: ChatAdapterOptions): ChatAdapterBuilder => {
    const {
        url,
        dataTransferMode,
        inputPreProcessor,
        outputPreProcessor,
        useInputSchema,
    } = options || {};

    if (dataTransferMode && dataTransferMode !== 'stream' && dataTransferMode !== 'fetch') {
        throw new Error(`Data transfer mode not supported`);
    }

    if (!url) {
        throw new Error(`Runnable URL is required`);
    }

    let newAdapter = createChatAdapter().withUrl(url);

    if (dataTransferMode) {
        newAdapter = newAdapter.withDataTransferMode(dataTransferMode);
    }

    if (inputPreProcessor) {
        newAdapter = newAdapter.withInputPreProcessor(inputPreProcessor);
    }

    if (outputPreProcessor) {
        newAdapter = newAdapter.withOutputPreProcessor(outputPreProcessor);
    }

    if (useInputSchema !== undefined) {
        newAdapter = newAdapter.withInputSchema(useInputSchema);
    }

    return newAdapter;
};
