import {NluxUsageError} from '@nlux/nlux';
import {GptStreamingAdapter} from '../adapters/stream';
import {OpenAIGptAbstractBuilder} from './abstractBuilder';
import {OpenAIGptFetchBuilder} from './fetchBuilder';

export class OpenAIGptStreamingBuilder extends OpenAIGptAbstractBuilder {
    constructor(cloneFrom?: OpenAIGptAbstractBuilder) {
        super(cloneFrom);
    }

    create() {
        if (!this.apiKey) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to create ChatGPT adapter. API key is not set. ' +
                    'You should call useApiKey() on instance to set the API key, or'
                    + 'pass the API key as an option with useAdapter() hook.',
            });
        }

        return new GptStreamingAdapter({
            apiKey: this.apiKey,
            model: this.model,
            initialSystemMessage: this.initialSystemMessage ?? undefined,
        });
    }

    useFetchingMode(): OpenAIGptAbstractBuilder {
        if (this.setStreamOrFetchCalled) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set data loading mode to fetch. Stream or fetch setter has already been called ' +
                    'by this builder. Make sure you are not calling stream() or fetch() twice.',
            });
        }

        this.dataExchangeMode = 'fetch';
        this.setStreamOrFetchCalled = true;

        return new OpenAIGptFetchBuilder(this) as unknown as OpenAIGptAbstractBuilder;
    }

    useStreamingMode(): OpenAIGptAbstractBuilder {
        return this;
    }
}
