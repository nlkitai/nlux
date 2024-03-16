import {ChatAdapter} from '@nlux/nlbridge';
import {AiContext as ReactAiContext} from '@nlux/react';
import {useContext, useEffect, useState} from 'react';
import {getChatAdapterBuilder} from './getChatAdapterBuilder';

export type ReactChatAdapterOptions = {
    url: string;
    dataTransferMode?: 'stream' | 'fetch';
    context?: ReactAiContext;
};

export const useChatAdapter = (options: ReactChatAdapterOptions): ChatAdapter => {
    const {context, url, dataTransferMode} = options;
    const coreContext = context?.ref ? useContext(context.ref) : undefined;
    const [adapter, setAdapter] = useState<ChatAdapter>(
        getChatAdapterBuilder({
            url,
            dataTransferMode,
            context: coreContext,
        }),
    );

    useEffect(() => {
        let newAdapter = getChatAdapterBuilder({
            url,
            dataTransferMode,
            context: coreContext,
        });

        setAdapter(newAdapter);
    }, [
        url,
        dataTransferMode,
        coreContext,
    ]);

    return adapter;
};
