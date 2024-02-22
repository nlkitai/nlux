import {AdapterExtras, NluxUsageError, StreamingAdapterObserver, warn} from '@nlux/core';
import {NlBridgeAbstractAdapter} from './adapter';

export class NlBridgeStreamAdapter extends NlBridgeAbstractAdapter {
    constructor(options: any) {
        super(options);
    }

    async fetchText(message: string, extras: AdapterExtras): Promise<string> {
        throw new NluxUsageError({
            source: this.constructor.name,
            message: 'Cannot fetch text using the stream adapter!',
        });
    }

    streamText(message: string, observer: StreamingAdapterObserver, extras: AdapterExtras): void {
        fetch(this.endpointUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'chat-stream',
                payload: {
                    message,
                    contextId: this.contextId,
                },
            }),
        }).then(async (response) => {
            if (!response.ok) {
                throw new Error(`NlBridge adapter returned status code: ${response.status}`);
            }

            if (!response.body) {
                throw new Error(`NlBridge adapter returned status code: ${response.status}`);
            }

            // Read a stream of server-sent events
            // and feed them to the observer as they are being generated
            const reader = response.body.getReader();
            const textDecoder = new TextDecoder();
            let doneReading = false;

            while (!doneReading) {
                const {value, done} = await reader.read();
                if (done) {
                    doneReading = true;
                    continue;
                }

                try {
                    const chunk = textDecoder.decode(value);
                    observer.next(chunk);
                } catch (err) {
                    warn(`Error parsing chunk by NlBridgeStreamAdapter: ${err}`);
                }
            }

            observer.complete();
        });
    }
}
