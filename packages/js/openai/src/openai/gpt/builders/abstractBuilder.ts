import {AdapterBuilder, NluxAdapter, NluxUsageError} from '@nlux/nlux';
import OpenAI from 'openai';
import {defaultChatGptModel, defaultDataExchangeMode} from '../adapters/config';
import {GptFetchAdapter} from '../adapters/fetch';
import {GptStreamingAdapter} from '../adapters/stream';
import {OpenAIChatModel} from '../types/models';

export abstract class OpenAIGptAbstractBuilder implements AdapterBuilder<
    OpenAI.Chat.Completions.ChatCompletionChunk | OpenAI.Chat.Completions.ChatCompletion,
    OpenAI.Chat.Completions.ChatCompletionMessageParam
> {
    protected apiKey: string | null = null;
    protected dataExchangeMode: 'stream' | 'fetch' = defaultDataExchangeMode;
    protected initialSystemMessage: string | null = null;
    protected model: OpenAIChatModel = defaultChatGptModel;

    protected setApiKeyCalled: boolean = false;
    protected setInitialSystemMessageCalled: boolean = false;
    protected setModelCalled: boolean = false;
    protected setStreamOrFetchCalled: boolean = false;

    protected constructor(cloneFrom?: OpenAIGptAbstractBuilder) {
        if (cloneFrom) {
            this.apiKey = cloneFrom.apiKey;
            this.dataExchangeMode = cloneFrom.dataExchangeMode;
            this.initialSystemMessage = cloneFrom.initialSystemMessage;
            this.model = cloneFrom.model;

            this.setApiKeyCalled = cloneFrom.setApiKeyCalled;
            this.setInitialSystemMessageCalled = cloneFrom.setInitialSystemMessageCalled;
            this.setModelCalled = cloneFrom.setModelCalled;
            this.setStreamOrFetchCalled = cloneFrom.setStreamOrFetchCalled;
        }
    }

    abstract create(): (GptFetchAdapter | GptStreamingAdapter) & NluxAdapter<any, any>;

    abstract useFetchingMode(): OpenAIGptAbstractBuilder;

    abstract useStreamingMode(): OpenAIGptAbstractBuilder;

    withApiKey(apiKey: string): OpenAIGptAbstractBuilder {
        if (this.setApiKeyCalled) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set API key. API key setter has already been called by this builder. ' +
                    'Make sure you are not calling withApiKey() twice.',
            });
        }

        this.apiKey = apiKey;
        this.setApiKeyCalled = true;
        return this;
    }

    withInitialSystemMessage(message: string): OpenAIGptAbstractBuilder {
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

    withModel(model: OpenAIChatModel): OpenAIGptAbstractBuilder {
        if (this.setModelCalled) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set model. Model setter has already been called ' +
                    'by this builder. Make sure you are not calling withModel() twice.',
            });
        }

        this.model = model;
        this.setModelCalled = true;
        return this;
    }
}
