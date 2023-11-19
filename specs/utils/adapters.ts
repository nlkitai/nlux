import {PromiseAdapter} from '@nlux-dev/nlux/src';

export const createPromiseAdapterController = () => {
    let resolvePromise: Function | null = null;
    let rejectPromise: Function | null = null;
    let lastMessageSent: string | null = null;

    const adapter: PromiseAdapter = {
        send: (message: string) => {
            lastMessageSent = message;

            return new Promise((resolve, reject) => {
                resolvePromise = resolve;
                rejectPromise = reject;
            });
        },
    };

    return {
        getLastMessage: () => lastMessageSent,
        adapter: adapter,
        resolve: (message: string) => {
            resolvePromise && resolvePromise(message);
        },
        reject: (message: string) => {
            rejectPromise && rejectPromise(message);
        },
    };
};

export type PromiseAdapterController = ReturnType<typeof createPromiseAdapterController>;
