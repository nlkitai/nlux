import {ChatAdapterBuilder, ChatAdapterOptions, createChatAdapter} from '@nlux/nlbridge';

export const getChatAdapterBuilder = (options: ChatAdapterOptions): ChatAdapterBuilder => {
    const {
        url,
        dataTransferMode,
        contextId,
        taskRunner,
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

    if (contextId) {
        newAdapter = newAdapter.withContextId(contextId);
    }

    if (taskRunner) {
        newAdapter = newAdapter.withTaskRunner(taskRunner);
    }

    return newAdapter;
};
