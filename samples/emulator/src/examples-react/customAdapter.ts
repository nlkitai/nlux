import {Adapter, StreamingAdapterObserver} from '@nlux/nlux';

export const myCustomStreamingAdapter: Adapter = {
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

export const myCustomPromiseAdapter: Adapter = {
    fetchText(message: string): Promise<string> {
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

