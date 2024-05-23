import {ChatAdapter, ChatAdapterExtras, StreamingAdapterObserver} from '@nlux/core';
import {vi} from 'vitest';

export const createAdapterController = <AiMsg = string>({
    includeBatchText = false,
    includeStreamText = false,
} = {}) => {
    let resolvePromise: Function | null = null;
    let rejectPromise: Function | null = null;
    let lastMessageSent: string | null = null;
    let streamObserver: StreamingAdapterObserver<AiMsg> | null = null;
    let extrasFromLastMessage: ChatAdapterExtras<AiMsg> | undefined | null = null;

    let batchTextMock = vi.fn();
    let streamTextMock = vi.fn();

    const createNewBatchTextMock = () => (
        message: string,
        extras: ChatAdapterExtras<AiMsg>,
    ) => {
        lastMessageSent = message;
        extrasFromLastMessage = extras;
        batchTextMock(message);

        return new Promise<AiMsg>((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
        });
    };

    const createNewStreamTextMock = () => (
        message: string,
        observer: StreamingAdapterObserver<AiMsg>,
        extras: ChatAdapterExtras<AiMsg>,
    ) => {
        lastMessageSent = message;
        streamObserver = observer;
        extrasFromLastMessage = extras;

        streamTextMock(message, observer);

        return new Promise<AiMsg>((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
        });
    };

    const adapter: ChatAdapter<AiMsg> = {
        batchText: includeBatchText ? createNewBatchTextMock() : undefined,
        streamText: includeStreamText ? createNewStreamTextMock() : undefined,
    };

    return Object.freeze({
        getLastMessage: () => lastMessageSent,
        getLastExtras: () => extrasFromLastMessage,
        adapter: adapter,
        batchTextMock,
        streamTextMock,
        resolve: (message: string) => {
            resolvePromise && resolvePromise(message);
            if (adapter.batchText) {
                adapter.batchText = createNewBatchTextMock();
            }
        },
        reject: (message: string) => {
            rejectPromise && rejectPromise(message);
            if (adapter.batchText) {
                adapter.batchText = createNewBatchTextMock();
            }
        },
        next: (message: string) => {
            streamObserver && streamObserver.next(message as AiMsg);
        },
        complete: () => {
            streamObserver && streamObserver.complete();
            if (adapter.streamText) {
                adapter.streamText = createNewStreamTextMock();
            }
        },
        error: (error: Error) => {
            streamObserver && streamObserver.error(error);
            if (adapter.streamText) {
                adapter.streamText = createNewStreamTextMock();
            }
        },
    });
};

export type AdapterController<AiMsg = string> = ReturnType<typeof createAdapterController<AiMsg>>;
