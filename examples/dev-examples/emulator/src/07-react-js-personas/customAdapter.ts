import {ChatAdapter, StreamingAdapterObserver} from '@nlux/core';

export const myCustomStreamingAdapter: ChatAdapter<string> = {
    streamText: (
        message: string,
        observer: StreamingAdapterObserver,
    ) => {
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

export const myCustomPromiseAdapter: ChatAdapter<string> = {
    batchText(message: string): Promise<string> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const messageToStream = 'Lorem promise ipsum **dolor** sit amet, consectetur adipiscing elit. ' +
                    'Sed non risus. Suspendisse lectus tortor, dignissim sit amet, ' +
                    'adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. ';

                resolve(messageToStream);
            }, 1000);
        });
    },
};

