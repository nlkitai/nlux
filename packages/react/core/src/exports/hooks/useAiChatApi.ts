import {useRef} from 'react';

export type AiChatApi = {
    sendMessage: (prompt: string) => void;
};

export type AiChatInternalApi = AiChatApi & {
    __setHost: (host: AiChatHost) => void;
    __unsetHost: () => void;
};

export type AiChatHost = {
    sendMessage: (prompt: string) => void;
};

const createVoidInternalApi = (setHost: (host: AiChatHost) => void = () => {
}) => {
    return {
        sendMessage: (prompt: string) => {
            throw new Error('AiChatApi is not connected to a host <AiChat /> component.');
        },

        // @ts-ignore
        __setHost: (host: AiChatApiHost) => {
            setHost(host);
        },

        // @ts-ignore
        __unsetHost: () => {
            // Do nothing
        },
    };
};

export const useAiChatApi = (): AiChatApi => {
    const currentHost = useRef<AiChatHost | null>(null);
    const api = useRef<AiChatInternalApi>(createVoidInternalApi());

    api.current.sendMessage = (prompt: string) => {
        if (!currentHost.current) {
            throw new Error('AiChatApi is not connected to a host <AiChat /> component.');
        }

        currentHost.current.sendMessage(prompt);
    };

    // @ts-ignore
    api.current.__setHost = (host: AiChatHost) => {
        currentHost.current = host;
    };

    // @ts-ignore
    api.current.__unsetHost = () => {
        currentHost.current = null;
    };

    return api.current;
};
