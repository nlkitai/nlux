import {ChatAdapterExtras, StreamingAdapterObserver} from '@nlux/core';
import {NluxUsageError} from '../../../../../shared/src/types/error';
import {LangServeAbstractAdapter} from './adapter';

export class LangServeFetchAdapter<MessageType = string> extends LangServeAbstractAdapter<MessageType> {
    constructor(options: any) {
        super(options);
    }

    async fetchText(message: string, extras: ChatAdapterExtras<MessageType>): Promise<MessageType> {
        const body = this.getRequestBody(message, extras.conversationHistory);
        const response = await fetch(this.endpointUrl, {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
            },
            body,
        });

        if (!response.ok) {
            throw new Error(`LangServe runnable returned status code: ${response.status}`);
        }

        const result = await response.json();
        if (typeof result !== 'object' || !result || result.output === undefined) {
            throw new Error(
                'Invalid response from LangServe runnable: Response is not an object ' +
                'or does not contain an "output" property',
            );
        }

        const output = (typeof result === 'object' && result) ? result.output : undefined;
        return this.getDisplayableMessageFromAiOutput(output);
    }

    streamText(message: string, observer: StreamingAdapterObserver, extras: ChatAdapterExtras<MessageType>): void {
        throw new NluxUsageError({
            source: this.constructor.name,
            message: 'Cannot stream text from the fetch adapter!',
        });
    }
}
