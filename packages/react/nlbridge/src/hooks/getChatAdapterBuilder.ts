import {ChatAdapter, ChatAdapterOptions, createChatAdapter} from '@nlux/nlbridge';

export const getChatAdapterBuilder = <AiMsg>(options: ChatAdapterOptions): ChatAdapter<AiMsg> => {
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

    let newAdapter = createChatAdapter<AiMsg>().withUrl(url);

    if (mode) {
        newAdapter = newAdapter.withMode(mode);
    }

    if (context) {
        newAdapter = newAdapter.withContext(context);
    }

    return newAdapter.create();
};
