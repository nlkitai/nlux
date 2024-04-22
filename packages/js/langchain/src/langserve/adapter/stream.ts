import {ChatAdapterExtras, StreamingAdapterObserver} from '@nlux/core';
import {NluxError, NluxUsageError} from '../../../../../shared/src/types/error';
import {warn} from '../../../../../shared/src/utils/warn';
import {parseChunk} from '../parser/parseChunk';
import {adapterErrorToExceptionId} from '../utils/adapterErrorToExceptionId';
import {LangServeAbstractAdapter} from './adapter';

export class LangServeStreamAdapter<MessageType> extends LangServeAbstractAdapter<MessageType> {
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
        const body = this.getRequestBody(message, extras.conversationHistory);
        fetch(this.endpointUrl, {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
            },
            body,
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new NluxError({
                        source: this.constructor.name,
                        message: `LangServe runnable returned status code: ${response.status}`,
                    });
                }

                if (!response.body) {
                    throw new NluxError({
                        source: this.constructor.name,
                        message: `LangServe runnable returned status code: ${response.status}`,
                    });
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

                    const chunk = textDecoder.decode(value);
                    const chunkContent = parseChunk(chunk);
                    if (Array.isArray(chunkContent)) {
                        for (const aiEvent of chunkContent) {
                            if (aiEvent.event === 'data' && aiEvent.data !== undefined) {
                                const message = this.getDisplayableMessageFromAiOutput(aiEvent.data);
                                if (typeof message === 'string' && message) {
                                    observer.next(message);
                                }
                            }

                            if (aiEvent.event === 'end') {
                                observer.complete();
                                doneReading = true;
                                break;
                            }
                        }
                    }

                    if (chunkContent instanceof Error) {
                        warn(chunkContent);
                        observer.error(chunkContent);
                        doneReading = true;
                    }
                }
            })
            .catch((error) => {
                warn(error);
                observer.error(new NluxUsageError({
                    source: this.constructor.name,
                    message: error.message,
                    exceptionId: adapterErrorToExceptionId(error) ?? undefined,
                }));
            });
    }
}
