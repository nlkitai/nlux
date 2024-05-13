import {ChatAdapter} from '@nlux/nlbridge';
import {AiContext as ReactAiContext} from '@nlux/react';
import {useContext, useEffect, useState} from 'react';
import {getChatAdapterBuilder} from './getChatAdapterBuilder';

export type ReactChatAdapterOptions = {
    url: string;
    mode?: 'chat' | 'copilot';
    context?: ReactAiContext;
    headers?: Record<string, string>;
};

export const useChatAdapter = <AiMsg = string>(options: ReactChatAdapterOptions): ChatAdapter<AiMsg> => {
    const {
        context,
        url,
        mode,
        headers,
    } = options;

    const coreContext = context?.ref ? useContext(context.ref) : undefined;
    const [adapter, setAdapter] = useState<ChatAdapter<AiMsg>>(
        getChatAdapterBuilder({
            url,
            mode,
            context: coreContext,
            headers,
        }),
    );

    useEffect(() => {
        const newAdapter = getChatAdapterBuilder<AiMsg>({
            url,
            mode,
            context: coreContext,
        });

        setAdapter(newAdapter);
    }, [
        url,
        coreContext,
        headers,
    ]);

    return adapter;
};
