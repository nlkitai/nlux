import {NluxUsageError} from '@nlux/nlux';
import {GptFetchAdapter} from '../adapters/fetch';
import {OpenAIGptAbstractBuilder} from './abstractBuilder';
import {OpenAIGptStreamingBuilder} from './streamingBuilder';

export class OpenAIGptFetchBuilder extends OpenAIGptAbstractBuilder {
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

        return new GptFetchAdapter({
            apiKey: this.apiKey!,
            model: this.model,
            initialSystemMessage: this.initialSystemMessage ?? undefined,
        });
    }

    useFetchingMode(): OpenAIGptAbstractBuilder {
        return this;
    }

    useStreamingMode(): OpenAIGptAbstractBuilder {
        if (this.setStreamOrFetchCalled) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set data loading mode to stream. Stream or fetch setter has already been called ' +
                    'by this builder. Make sure you are not calling stream() or fetch() twice.',
            });
        }

        this.dataExchangeMode = 'stream';
        this.setStreamOrFetchCalled = true;

        return new OpenAIGptStreamingBuilder(this) as unknown as OpenAIGptAbstractBuilder;
    }
}
