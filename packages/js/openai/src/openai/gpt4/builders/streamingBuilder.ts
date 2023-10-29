import {NluxUsageError} from '@nlux/nlux';
import {Gpt4StreamingAdapter} from '../adapters/stream';
import {OpenAiGpt4AbstractBuilder} from './abstractBuilder';

export class OpenAiGpt4StreamingBuilder extends OpenAiGpt4AbstractBuilder {
    dataExchangeMode: 'stream' = 'stream';

    constructor(cloneFrom?: OpenAiGpt4AbstractBuilder) {
        super(cloneFrom);
    }

    create() {
        if (!this.apiKey) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to create GPT4 adapter. API key is not set. ' +
                    'You should call useApiKey() on instance to set the API key.',
            });
        }

        return new Gpt4StreamingAdapter({
            apiKey: this.apiKey,
            timeout: this.timeout,
            historyDepthToInclude: this.historyDepth,
            initialSystemMessage: this.initialSystemMessage ?? undefined,
        });
    }

    useFetchingMode(): OpenAiGpt4AbstractBuilder {
        throw new NluxUsageError({
            source: this.constructor.name,
            message: 'Unable to set data loading mode to fetch. This builder is configured to use the stream API. ' +
                'You cannot change it to use the fetch API.',
        });
    }

    useStreamingMode(): OpenAiGpt4AbstractBuilder {
        throw new NluxUsageError({
            source: this.constructor.name,
            message: 'Unable to set data loading mode to stream. This builder is already configured to use '
                + 'the stream API.',
        });
    }
}
