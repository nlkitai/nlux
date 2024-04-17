import {ChatAdapterExtras, StreamingAdapterObserver} from '@nlux-dev/core/src';
import {vi} from 'vitest';

export const createAdapterController = <AiMsg = string>({
    includeFetchText = false,
    includeStreamText = false,
} = {}) => {
    let resolvePromise: Function | null = null;
    let rejectPromise: Function | null = null;
    let lastMessageSent: string | null = null;
    let streamTextObserver: StreamingAdapterObserver | null = null;
    let extrasFromLastMessage: ChatAdapterExtras<AiMsg> | undefined | null = null;

    let fetchTextMock = vi.fn();
    let streamTextMock = vi.fn();

    const createNewFetchTextMock = () => (
        message: string,
        extras: ChatAdapterExtras<AiMsg>,
    ) => {
        lastMessageSent = message;
        extrasFromLastMessage = extras;
        fetchTextMock(message);

        return new Promise<AiMsg>((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
        });
    };

    const createNewStreamTextMock = () => (
        message: string, observer: StreamingAdapterObserver, extras: ChatAdapterExtras<AiMsg>,
    ) => {
        lastMessageSent = message;
        streamTextObserver = observer;
        extrasFromLastMessage = extras;

        streamTextMock(message, observer);

        return new Promise<AiMsg>((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
        });
    };

    const adapter = {
        fetchText: includeFetchText ? createNewFetchTextMock() : undefined,
        streamText: includeStreamText ? createNewStreamTextMock() : undefined,
    };

    return Object.freeze({
        getLastMessage: () => lastMessageSent,
        getLastExtras: () => extrasFromLastMessage,
        adapter: adapter,
        fetchTextMock,
        streamTextMock,
        resolve: (message: string) => {
            resolvePromise && resolvePromise(message);
            if (adapter.fetchText) {
                adapter.fetchText = createNewFetchTextMock();
            }
        },
        reject: (message: string) => {
            rejectPromise && rejectPromise(message);
            if (adapter.fetchText) {
                adapter.fetchText = createNewFetchTextMock();
            }
        },
        next: (message: string) => {
            streamTextObserver && streamTextObserver.next(message);
        },
        complete: () => {
            streamTextObserver && streamTextObserver.complete();
            if (adapter.streamText) {
                adapter.streamText = createNewStreamTextMock();
            }
        },
        error: (error: Error) => {
            streamTextObserver && streamTextObserver.error(error);
            if (adapter.streamText) {
                adapter.streamText = createNewStreamTextMock();
            }
        },
    });
};

export type AdapterController<AiMsg = string> = ReturnType<typeof createAdapterController<AiMsg>>;
