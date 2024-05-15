import {ChatAdapterOptions, createChatAdapter} from '@nlux/nlbridge';
import {StandardChatAdapter} from '@nlux/react';

export const getChatAdapterBuilder = <AiMsg>(options: ChatAdapterOptions): StandardChatAdapter<AiMsg> => {
    const {
        url,
        mode,
        context,
        headers,
    } = options || {};

    if (mode && mode !== 'copilot' && mode !== 'chat') {
        throw new Error(`Data transfer mode not supported`);
    }

    if (!url) {
        throw new Error(`Runnable URL is required`);
    }

    let newAdapter = createChatAdapter<AiMsg>().withUrl(url);

    if (mode) {
        newAdapter = newAdapter.withMode(mode);
    }

    if (context) {
        newAdapter = newAdapter.withContext(context);
    }

    if (headers) {
        newAdapter = newAdapter.withHeaders(headers);
    }

    return newAdapter.create();
};
