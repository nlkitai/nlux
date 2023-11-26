import {DataTransferMode, NluxUsageError, NluxValidationError} from '@nlux/nlux';
import {HfAdapterImpl} from '../adapter/adapter';
import {HfInputPreProcessor} from '../types/inputPreProcessor';
import {HfOutputPreProcessor} from '../types/outputPreProcessor';
import {HfAdapterBuilder} from './builder';

export class AdapterBuilderImpl implements HfAdapterBuilder {
    private theAuthToken: string | null = null;
    private theDataTransferMode: DataTransferMode = 'stream';
    private theEndpoint: string | null = null;
    private theInputPreProcessor: HfInputPreProcessor | null = null;
    private theMaxNewTokens: number | null = null;
    private theModel: string | null = null;
    private theOutputPreProcessor: HfOutputPreProcessor | null = null;
    private theSystemMessage: string | null = null;

    private withDataTransferModeCalled = false;

    create(): HfAdapterImpl {
        if (!this.theModel && !this.theEndpoint) {
            throw new NluxValidationError({
                source: this.constructor.name,
                message: 'You must provide a model or an endpoint using the "withModel()" method or the ' +
                    '"withEndpoint()" method!',
            });
        }

        return new HfAdapterImpl({
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

    withAuthToken(authToken: string): HfAdapterBuilder {
        if (this.theAuthToken !== null) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the auth token more than once',
            });
        }

        this.theAuthToken = authToken;
        return this;
    }

    withDataTransferMode(mode: DataTransferMode): HfAdapterBuilder {
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

    withEndpoint(endpoint: string): HfAdapterBuilder {
        if (this.theEndpoint !== null) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the endpoint because a model or an endpoint has already been set',
            });
        }

        this.theEndpoint = endpoint;
        return this;
    }

    withInputPreProcessor(inputPreProcessor: HfInputPreProcessor): HfAdapterBuilder {
        if (this.theInputPreProcessor !== null) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the input pre-processor more than once',
            });
        }

        this.theInputPreProcessor = inputPreProcessor;
        return this;
    }

    withMaxNewTokens(maxNewTokens: number): HfAdapterBuilder {
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

    withOutputPreProcessor(outputPreProcessor: HfOutputPreProcessor): HfAdapterBuilder {
        if (this.theOutputPreProcessor !== null) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the output pre-processor more than once',
            });
        }

        this.theOutputPreProcessor = outputPreProcessor;
        return this;
    }

    withSystemMessage(message: string): HfAdapterBuilder {
        if (this.theSystemMessage !== null) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the system message more than once',
            });
        }

        this.theSystemMessage = message;
        return this;
    }
};

