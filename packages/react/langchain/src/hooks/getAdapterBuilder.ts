import {ChatAdapterBuilder, ChatAdapterOptions, createChatAdapter} from '@nlux/langchain';

export const getAdapterBuilder = <AiMsg>(options: ChatAdapterOptions<AiMsg>): ChatAdapterBuilder<AiMsg> => {
    const {
        url,
        dataTransferMode,
        headers,
        config,
        inputPreProcessor,
        outputPreProcessor,
        useInputSchema,
    } = options || {};

    if (dataTransferMode && dataTransferMode !== 'stream' && dataTransferMode !== 'batch') {
        throw new Error(`Data transfer mode not supported`);
    }

    if (!url) {
        throw new Error(`Runnable URL is required`);
    }

    let newAdapter = createChatAdapter<AiMsg>().withUrl(url);

    if (dataTransferMode) {
        newAdapter = newAdapter.withDataTransferMode(dataTransferMode);
    }

    if (headers) {
        newAdapter = newAdapter.withHeaders(headers);
    }

    if (config) {
        newAdapter = newAdapter.withConfig(config);
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
