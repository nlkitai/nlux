import {NluxUsageError} from '@nlux/nlux';
import {Gpt4FetchAdapter} from '../adapters/fetch';
import {Gpt4StreamingAdapter} from '../adapters/stream';
import {OpenAiGpt4AbstractBuilder} from './abstractBuilder';
import {OpenAiGpt4StreamingBuilder} from './streamingBuilder';

export class OpenAiGpt4Builder extends OpenAiGpt4AbstractBuilder {

    constructor() {
        super();
    }

    create(): Gpt4FetchAdapter | Gpt4StreamingAdapter {
        if (!this.apiKey) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to create GPT4 adapter. API key is not set. ' +
                    'You should call useApiKey() on instance to set the API key.',
            });
        }

        if (this.dataExchangeMode === 'stream') {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to create GPT4 adapter. This builder is configured to use the stream API '
                    + 'because useStreamingMode() was called. You should call use the builder instance returned '
                    + 'by useStreamingMode() to create the builder.',
            });
        }

        return new Gpt4FetchAdapter({
            apiKey: this.apiKey!,
            timeout: this.timeout,
            historyDepthToInclude: this.historyDepth,
        });
    }

    useFetchingMode(): OpenAiGpt4AbstractBuilder {
        if (this.setStreamOrFetchCalled) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set data loading mode to fetch. Stream or fetch setter has already been called ' +
                    'by this builder. Make sure you are not calling stream() or fetch() twice.',
            });
        }

        this.dataExchangeMode = 'fetch';
        this.setStreamOrFetchCalled = true;

        return this as unknown as OpenAiGpt4AbstractBuilder;
    }

    useStreamingMode(): OpenAiGpt4AbstractBuilder {
        if (this.setStreamOrFetchCalled) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set data loading mode to stream. Stream or fetch setter has already been called ' +
                    'by this builder. Make sure you are not calling stream() or fetch() twice.',
            });
        }

        this.dataExchangeMode = 'stream';
        this.setStreamOrFetchCalled = true;

        return new OpenAiGpt4StreamingBuilder(this) as unknown as OpenAiGpt4AbstractBuilder;
    }
}
