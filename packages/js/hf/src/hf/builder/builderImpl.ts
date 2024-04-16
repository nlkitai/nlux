import {DataTransferMode} from '@nlux/core';
import {NluxUsageError, NluxValidationError} from '../../../../../shared/src/types/error';
import {HfChatAdapterImpl} from '../adapter/chatAdapter';
import {HfInputPreProcessor} from '../types/inputPreProcessor';
import {HfOutputPreProcessor} from '../types/outputPreProcessor';
import {ChatAdapterBuilder} from './builder';

export class ChatAdapterBuilderImpl<AiMsg> implements ChatAdapterBuilder<AiMsg> {
    private theAuthToken: string | null = null;
    private theDataTransferMode: DataTransferMode = 'stream';
    private theEndpoint: string | null = null;
    private theInputPreProcessor: HfInputPreProcessor<AiMsg> | null = null;
    private theMaxNewTokens: number | null = null;
    private theModel: string | null = null;
    private theOutputPreProcessor: HfOutputPreProcessor<AiMsg> | null = null;
    private theSystemMessage: string | null = null;

    private withDataTransferModeCalled = false;

    create(): HfChatAdapterImpl<AiMsg> {
        if (!this.theModel && !this.theEndpoint) {
            throw new NluxValidationError({
                source: this.constructor.name,
                message: 'You must provide a model or an endpoint using the "withModel()" method or the ' +
                    '"withEndpoint()" method!',
            });
        }

        return new HfChatAdapterImpl({
            dataTransferMode: this.theDataTransferMode,
            model: this.theModel ?? undefined,
            endpoint: this.theEndpoint ?? undefined,
            authToken: this.theAuthToken ?? undefined,
            preProcessors: {
                input: this.theInputPreProcessor ?? undefined,
                output: this.theOutputPreProcessor ?? undefined,
            },
            maxNewTokens: this.theMaxNewTokens ?? undefined,
            systemMessage: this.theSystemMessage ?? undefined,
        });
    }

    withAuthToken(authToken: string): ChatAdapterBuilder<AiMsg> {
        if (this.theAuthToken !== null) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the auth token more than once',
            });
        }

        this.theAuthToken = authToken;
        return this;
    }

    withDataTransferMode(mode: DataTransferMode): ChatAdapterBuilder<AiMsg> {
        if (this.withDataTransferModeCalled) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the data loading mode more than once',
            });
        }

        this.theDataTransferMode = mode;
        this.withDataTransferModeCalled = true;
        return this;
    }

    withEndpoint(endpoint: string): ChatAdapterBuilder<AiMsg> {
        if (this.theEndpoint !== null) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the endpoint because a model or an endpoint has already been set',
            });
        }

        this.theEndpoint = endpoint;
        return this;
    }

    withInputPreProcessor(inputPreProcessor: HfInputPreProcessor<AiMsg>): ChatAdapterBuilder<AiMsg> {
        if (this.theInputPreProcessor !== null) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the input pre-processor more than once',
            });
        }

        this.theInputPreProcessor = inputPreProcessor;
        return this;
    }

    withMaxNewTokens(maxNewTokens: number): ChatAdapterBuilder<AiMsg> {
        if (this.theMaxNewTokens !== null) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the max new tokens more than once',
            });
        }

        this.theMaxNewTokens = maxNewTokens;
        return this;
    }

    withModel(model: string) {
        if (this.theModel !== null) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the model because a model or an endpoint has already been set',
            });
        }

        this.theModel = model;
        return this;
    }

    withOutputPreProcessor(outputPreProcessor: HfOutputPreProcessor<AiMsg>): ChatAdapterBuilder<AiMsg> {
        if (this.theOutputPreProcessor !== null) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the output pre-processor more than once',
            });
        }

        this.theOutputPreProcessor = outputPreProcessor;
        return this;
    }

    withSystemMessage(message: string): ChatAdapterBuilder<AiMsg> {
        if (this.theSystemMessage !== null) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the system message more than once',
            });
        }

        this.theSystemMessage = message;
        return this;
    }
}
