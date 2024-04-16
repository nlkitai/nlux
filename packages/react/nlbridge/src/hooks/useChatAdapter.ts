import {ChatAdapter} from '@nlux/nlbridge';
import {AiContext as ReactAiContext} from '@nlux/react';
import {useContext, useEffect, useState} from 'react';
import {getChatAdapterBuilder} from './getChatAdapterBuilder';

export type ReactChatAdapterOptions = {
    url: string;
    mode?: 'chat' | 'copilot';
    context?: ReactAiContext;
};

export const useChatAdapter = <MessageType = string>(options: ReactChatAdapterOptions): ChatAdapter<MessageType> => {
    const {context, url, mode} = options;
    const coreContext = context?.ref ? useContext(context.ref) : undefined;
    const [adapter, setAdapter] = useState<ChatAdapter<MessageType>>(
        getChatAdapterBuilder({
            url,
            mode,
            context: coreContext,
        }),
    );

    useEffect(() => {
        let newAdapter = getChatAdapterBuilder<MessageType>({
            url,
            mode,
            context: coreContext,
        });

        setAdapter(newAdapter);
    }, [
        url,
        coreContext,
    ]);

    return adapter;
};
