import {ChatAdapter, ChatAdapterOptions, createChatAdapter} from '@nlux/nlbridge';

export const getChatAdapterBuilder = (options: ChatAdapterOptions): ChatAdapter => {
    const {
        url,
        mode,
        context,
    } = options || {};

    if (mode && mode !== 'copilot' && mode !== 'chat') {
        throw new Error(`Data transfer mode not supported`);
    }

    if (!url) {
        throw new Error(`Runnable URL is required`);
    }

    let newAdapter = createChatAdapter().withUrl(url);

    if (mode) {
        newAdapter = newAdapter.withMode(mode);
    }

    if (context) {
        newAdapter = newAdapter.withContext(context);
    }

    return newAdapter.create();
};
