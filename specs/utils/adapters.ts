import {Adapter, StreamingAdapterObserver} from '@nlux/nlux';

export const createPromiseAdapterController = ({
    includeFetchText = true,
    includeStreamText = true,
} = {}) => {
    let resolvePromise: Function | null = null;
    let rejectPromise: Function | null = null;
    let lastMessageSent: string | null = null;
    let streamTextObserver: StreamingAdapterObserver | null = null;

    let fetchTextMock = jest.fn();
    let streamTextMock = jest.fn();

    const fetchText = (message: string) => {
        lastMessageSent = message;
        fetchTextMock(message);

        return new Promise<string>((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
        });
    };

    const streamText = (message: string, observer: StreamingAdapterObserver) => {
        lastMessageSent = message;
        streamTextObserver = observer;
        streamTextMock(message, observer);

        return new Promise((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
        });
    };

    const adapter: Adapter = {
        fetchText: includeFetchText ? fetchText : undefined,
        streamText: includeStreamText ? streamText : undefined,
    };

    return Object.freeze({
        getLastMessage: () => lastMessageSent,
        adapter: adapter,
        fetchTextMock,
        streamTextMock,
        resolve: (message: string) => {
            resolvePromise && resolvePromise(message);
        },
        reject: (message: string) => {
            rejectPromise && rejectPromise(message);
        },
        next: (message: string) => {
            streamTextObserver && streamTextObserver.next(message);
        },
        complete: () => {
            streamTextObserver && streamTextObserver.complete();
        },
        error: (error: Error) => {
            streamTextObserver && streamTextObserver.error(error);
        },
    });
};

export type AdapterController = ReturnType<typeof createPromiseAdapterController>;
