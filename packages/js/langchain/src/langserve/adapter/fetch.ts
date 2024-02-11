import {AdapterExtras, NluxUsageError, StreamingAdapterObserver} from '@nlux/core';
import {LangServeAbstractAdapter} from './adapter';

export class LangServeFetchAdapter extends LangServeAbstractAdapter {
    constructor(options: any) {
        super(options);
    }

    async fetchText(message: string, extras: AdapterExtras): Promise<string> {
        const body = this.getRequestBody(message, extras.conversationHistory);
        const response = await fetch(this.endpointUrl, {
            method: 'POST',
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
        return this.getDisplayableMessageFromAiOutput(output) ?? '';
    }

    streamText(message: string, observer: StreamingAdapterObserver, extras: AdapterExtras): void {
        throw new NluxUsageError({
            source: this.constructor.name,
            message: 'Cannot stream text from the fetch adapter!',
        });
    }
}
