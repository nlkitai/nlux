import {useRef} from 'react';

/**
 * AiChat API methods.
 */
export type AiChatApi = {
    /**
     * Types the message in the composer and sends it to the chat adapter automatically.
     *
     * @param {string} prompt
     */
    sendMessage: (prompt: string) => void;

    /**
     * Cancel the last message request. If a message is being sent, it will be cancelled.
     * If a message is being generated (in streaming mode), the generation will be stopped and the message will removed.
     * If no message is being sent, this method does nothing.
     */
    cancelLastMessageRequest: () => void;

    /**
     * Reset the conversation.
     */
    resetConversation: () => void;
};

export type AiChatInternalApi = AiChatApi & {
    __setHost: (host: AiChatHost) => void;
    __unsetHost: () => void;
};

export type AiChatHost = {
    sendMessage: (prompt: string) => void;
    resetConversation: () => void;
};

const createVoidInternalApi = (setHost: (host: AiChatHost) => void = () => {
}) => {
    return {
        sendMessage: (prompt: string) => {
            throw new Error('AiChatApi is not connected to a host <AiChat /> component.');
        },

        resetConversation: () => {
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

/**
 * Hook to get the AiChat API reference.
 *
 * @returns {AiChatApi}
 */
export const useAiChatApi = (): AiChatApi => {
    const currentHost = useRef<AiChatHost | null>(null);
    const api = useRef<AiChatInternalApi>(createVoidInternalApi());

    api.current.sendMessage = (prompt: string) => {
        if (!currentHost.current) {
            throw new Error('AiChatApi is not connected to a host <AiChat /> component.');
        }

        currentHost.current.sendMessage(prompt);
    };

    api.current.resetConversation = () => {
        if (!currentHost.current) {
            throw new Error('AiChatApi is not connected to a host <AiChat /> component.');
        }

        currentHost.current.resetConversation();
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
