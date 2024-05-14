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

    const [
        headersToUse,
        setHeadersToUse,
    ] = useState<Record<string, string> | undefined>(headers);

    useEffect(() => {
        if (!headers && headersToUse) {
            setHeadersToUse(undefined);
            return;
        }

        if (headers && !headersToUse) {
            setHeadersToUse(headers);
            return;
        }

        // Only update if headers have changed
        if (headers && headersToUse) {
            if (Object.keys(headers).length !== Object.keys(headersToUse).length) {
                setHeadersToUse(headers);
                return;
            }

            for (const key in headers) {
                if (headers[key] !== headersToUse[key]) {
                    setHeadersToUse(headers);
                    return;
                }
            }
        }
    }, [headers]);

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
            headers: headersToUse,
            context: coreContext,
        });

        setAdapter(newAdapter);
    }, [
        url,
        mode,
        headersToUse,
        coreContext,
    ]);

    return adapter;
};
