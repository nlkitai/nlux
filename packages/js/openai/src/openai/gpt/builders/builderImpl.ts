import {DataTransferMode, NluxUsageError} from '@nlux/core';
import {defaultDataTransferMode} from '../adapters/config';
import {OpenAiFetchAdapter} from '../adapters/fetch';
import {OpenAiStreamingAdapter} from '../adapters/stream';
import {OpenAiAdapterOptions} from '../types/adapterOptions';
import {OpenAIModel} from '../types/model';
import {OpenAiAdapterBuilder} from './builder';

export class OpenAiAdapterBuilderImpl implements OpenAiAdapterBuilder {
    protected apiKey: string | null = null;
    protected dataTransferMode: DataTransferMode = defaultDataTransferMode;
    protected model: OpenAIModel | null = null;
    protected systemMessage: string | null = null;
    protected withApiKeyCalled: boolean = false;
    protected withDataTransferModeCalled: boolean = false;
    protected withModelCalled: boolean = false;
    protected withSystemMessageCalled: boolean = false;

    constructor(cloneFrom?: OpenAiAdapterBuilderImpl) {
        if (cloneFrom) {
            this.apiKey = cloneFrom.apiKey;
            this.dataTransferMode = cloneFrom.dataTransferMode;
            this.model = cloneFrom.model;
            this.systemMessage = cloneFrom.systemMessage;

            this.withApiKeyCalled = cloneFrom.withApiKeyCalled;
            this.withSystemMessageCalled = cloneFrom.withSystemMessageCalled;
            this.withModelCalled = cloneFrom.withModelCalled;
            this.withDataTransferModeCalled = cloneFrom.withDataTransferModeCalled;
        }
    }

    create(): OpenAiStreamingAdapter | OpenAiFetchAdapter {
        if (!this.apiKey) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to create OpenAI adapter. API key is missing. ' +
                    'Make sure you are calling withApiKey() before calling create().',
            });
        }

        const options: OpenAiAdapterOptions = {
            apiKey: this.apiKey,
            dataTransferMode: this.dataTransferMode,
            model: this.model ?? undefined,
            systemMessage: this.systemMessage ?? undefined,
        };

        if (this.dataTransferMode === 'stream') {
            return new OpenAiStreamingAdapter(options);
        }

        return new OpenAiFetchAdapter(options);
    }

    withApiKey(apiKey: string): OpenAiAdapterBuilderImpl {
        if (this.withApiKeyCalled) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set API key. API key setter has already been called by this builder. ' +
                    'Make sure you are not calling withApiKey() twice.',
            });
        }

        this.apiKey = apiKey;
        this.withApiKeyCalled = true;
        return this;
    }

    withDataTransferMode(mode: DataTransferMode): OpenAiAdapterBuilderImpl {
        if (this.withDataTransferModeCalled) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set data loading mode. Stream or fetch setter has already been called ' +
                    'by this builder. Make sure you are not calling stream() or fetch() twice.',
            });
        }

        this.dataTransferMode = mode;
        this.withDataTransferModeCalled = true;

        return this;
    }

    withModel(model: OpenAIModel): OpenAiAdapterBuilderImpl {
        if (this.withModelCalled) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set model. Model setter has already been called ' +
                    'by this builder. Make sure you are not calling withModel() twice.',
            });
        }

        this.model = model;
        this.withModelCalled = true;
        return this;
    }

    withSystemMessage(message: string): OpenAiAdapterBuilderImpl {
        if (this.withSystemMessageCalled) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set initial system message. Initial system message setter has already been ' +
                    'called by this builder. Make sure you are not calling withSystemMessage() twice.',
            });
        }

        this.systemMessage = message ?? null;
        this.withSystemMessageCalled = true;

        return this;
    }
}
