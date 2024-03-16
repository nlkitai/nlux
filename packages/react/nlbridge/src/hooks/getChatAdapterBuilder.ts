import {ChatAdapter, ChatAdapterOptions, createChatAdapter} from '@nlux/nlbridge';

export const getChatAdapterBuilder = (options: ChatAdapterOptions): ChatAdapter => {
    const {
        url,
        dataTransferMode,
        context,
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

    if (context) {
        newAdapter = newAdapter.withContext(context);
    }

    return newAdapter.create();
};
