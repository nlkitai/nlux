import {ChatAdapter, ChatAdapterExtras, StreamingAdapterObserver} from '@nlux/react';

export const myCustomStreamingAdapter: ChatAdapter = {
    streamText: (
        message: string,
        observer: StreamingAdapterObserver,
        extras: ChatAdapterExtras,
    ) => {
        console.dir(extras, {depth: 3});
        setTimeout(() => {
            const messageToStream = 'Lorem stream ipsum **dolor** sit amet, consectetur adipiscing elit. ' +
                'Sed non risus. Suspendisse lectus tortor, dignissim sit amet, ' +
                'adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. ';

            const mockTokens = messageToStream.split(' ');
            mockTokens.forEach((token) => {
                observer.next(token + ' ');
            });

            observer.complete();
        }, 100);
    },
};

export const myCustomPromiseAdapter: ChatAdapter = {
    fetchText(message: string, extras: ChatAdapterExtras): Promise<string> {
        console.dir(extras, {depth: 3});
        return new Promise((resolve) => {
            setTimeout(() => {
                const messageToStream = 'Lorem promise ipsum **dolor** sit amet, consectetur adipiscing elit. ' +
                    'Sed non risus. Suspendisse lectus tortor, dignissim sit amet, ' +
                    'adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. ';

                resolve(messageToStream);
            }, 100);
        });
    },
};

