import {Adapter, AdapterBuilder, NluxUsageError} from '@nlux/nlux';
import OpenAI from 'openai';
import {Gpt4FetchAdapter} from '../adapters/fetch';
import {Gpt4StreamingAdapter} from '../adapters/stream';

export abstract class OpenAiGpt4AbstractBuilder implements AdapterBuilder<
    OpenAI.Chat.Completions.ChatCompletionChunk | OpenAI.Chat.Completions.ChatCompletion,
    OpenAI.Chat.Completions.ChatCompletionMessageParam
> {
    static defaultTimeout: number = 30000; // 30 seconds

    public apiKey: string | null = null;
    public dataExchangeMode: 'stream' | 'fetch' = 'fetch';
    public historyDepth: number | 'max' = 'max';
    public timeout: number = OpenAiGpt4AbstractBuilder.defaultTimeout;
    protected initialSystemMessage: string | null = null;
    protected setApiKeyCalled: boolean = false;
    protected setHistoryDepthCalled: boolean = false;
    protected setInitialSystemMessageCalled: boolean = false;
    protected setStreamOrFetchCalled: boolean = false;
    protected setTimeOutCalled: boolean = false;

    protected constructor(cloneFrom?: OpenAiGpt4AbstractBuilder) {
        if (cloneFrom) {
            this.apiKey = cloneFrom.apiKey;
            this.dataExchangeMode = cloneFrom.dataExchangeMode;
            this.historyDepth = cloneFrom.historyDepth;
            this.timeout = cloneFrom.timeout;
            this.setApiKeyCalled = cloneFrom.setApiKeyCalled;
            this.setHistoryDepthCalled = cloneFrom.setHistoryDepthCalled;
            this.setStreamOrFetchCalled = cloneFrom.setStreamOrFetchCalled;
            this.setTimeOutCalled = cloneFrom.setTimeOutCalled;
        }
    }

    abstract create(): (Gpt4FetchAdapter | Gpt4StreamingAdapter) & Adapter<any, any>;

    abstract useFetchingMode(): OpenAiGpt4AbstractBuilder;

    abstract useStreamingMode(): OpenAiGpt4AbstractBuilder;

    withApiKey(apiKey: string): OpenAiGpt4AbstractBuilder {
        if (this.setApiKeyCalled) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set API key. API key setter has already been called by this builder. ' +
                    'Make sure you are not calling useApiKey() twice.',
            });
        }

        this.apiKey = apiKey;
        this.setApiKeyCalled = true;
        return this;
    }

    withHistoryDepth(depth: number | 'max' = 'max'): OpenAiGpt4AbstractBuilder {
        if (this.setHistoryDepthCalled) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set history depth. History depth setter has already been called ' +
                    'by this builder. Make sure you are not calling includeHistoryDepth() twice.',
            });
        }

        this.historyDepth = depth;
        this.setHistoryDepthCalled = true;
        return this;
    }

    withInitialSystemMessage(message: string): OpenAiGpt4AbstractBuilder {
        if (this.setInitialSystemMessageCalled) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set initial system message. Initial system message setter has already been ' +
                    'called by this builder. Make sure you are not calling withInitialSystemMessage() twice.',
            });
        }

        this.initialSystemMessage = message ?? null;
        this.setInitialSystemMessageCalled = true;

        return this;
    }

    withTimeout(timeoutInMilliseconds: number): OpenAiGpt4AbstractBuilder {
        if (this.setTimeOutCalled) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set timeout. Timeout setter has already been called ' +
                    'by this builder. Make sure you are not calling withTimeout() twice.',
            });
        }

        this.timeout = timeoutInMilliseconds;
        this.setTimeOutCalled = true;
        return this;
    }
}
