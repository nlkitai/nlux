import {ChatAdapterExtras, StreamingAdapterObserver} from '@nlux/core';
import {NluxUsageError} from '../../../../../shared/src/types/error';
import {warn} from '../../../../../shared/src/utils/warn';
import {NLBridgeAbstractAdapter} from './adapter';

export class NLBridgeStreamAdapter<MessageType> extends NLBridgeAbstractAdapter<MessageType> {
    constructor(options: any) {
        super(options);
    }

    async fetchText(message: string, extras: ChatAdapterExtras<MessageType>): Promise<MessageType> {
        throw new NluxUsageError({
            source: this.constructor.name,
            message: 'Cannot fetch text using the stream adapter!',
        });
    }

    streamText(message: string, observer: StreamingAdapterObserver, extras: ChatAdapterExtras<MessageType>): void {
        const submitPrompt = () => fetch(this.endpointUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'chat-stream',
                payload: {
                    message,
                    contextId: this.context?.contextId,
                },
            }),
        }).then(async (response) => {
            if (!response.ok) {
                throw new Error(`NLBridge adapter returned status code: ${response.status}`);
            }

            if (!response.body) {
                throw new Error(`NLBridge adapter returned status code: ${response.status}`);
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
                    warn(`Error parsing chunk by NLBridgeStreamAdapter: ${err}`);
                }
            }

            observer.complete();
        });

        if (this.context && this.context.contextId) {
            this.context.flush().then(() => {
                submitPrompt();
            }).catch(() => {
                // Submit prompt even when flushing fails
                submitPrompt();
            });

            return;
        }

        submitPrompt();
    }
}
