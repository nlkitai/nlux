import {BedrockRuntimeClientConfigType, InferenceConfiguration} from '@aws-sdk/client-bedrock-runtime';
import {DataTransferMode} from '@nlux/core';
import {NluxUsageError, NluxValidationError} from '@shared/types/error';
import {BedrockChatAdapterImpl} from '../adapter/chatAdapter';
import {ChatAdapterBuilder} from './builder';

export class ChatAdapterBuilderImpl<AiMsg>
    implements ChatAdapterBuilder<AiMsg> {
    private credentials: BedrockRuntimeClientConfigType['credentials'] | null =
        null;
    private inferenceConfig: InferenceConfiguration | null = null;
    private region: string | null = null;
    private theDataTransferMode: DataTransferMode = 'stream';
    private theModel: string | null = null;
    private withDataTransferModeCalled = false;

    create(): BedrockChatAdapterImpl<AiMsg> {
        if (!this.theModel) {
            throw new NluxValidationError({
                source: this.constructor.name,
                message:
                    'You must provide a model or an endpoint using the "withModel()" method or the ' +
                    '"withEndpoint()" method!',
            });
        }

        return new BedrockChatAdapterImpl({
            dataTransferMode: this.theDataTransferMode,
            model: this.theModel ?? undefined,
            credentials: this.credentials ?? undefined,
            region: this.region ?? undefined,

            inferenceConfig: this.inferenceConfig ?? undefined,
        });
    }

    withCredintial(
        cred: BedrockRuntimeClientConfigType['credentials'],
    ): ChatAdapterBuilder<AiMsg> {
        if (this.credentials !== null) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the cred token more than once',
            });
        }

        this.credentials = cred;
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

    withInferenceConfig(
        inferenceConfig: InferenceConfiguration,
    ): ChatAdapterBuilder<AiMsg> {
        if (this.inferenceConfig !== null) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Cannot set the Inference Config more than once',
            });
        }
        this.inferenceConfig = inferenceConfig;
        return this;
    }

    withModel(model: string) {
        if (this.theModel !== null) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message:
                    'Cannot set the model because a model or an endpoint has already been set',
            });
        }

        this.theModel = model;
        return this;
    }

    withRegion(region: string): ChatAdapterBuilder<AiMsg> {
        if (this.region !== null) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message:
                    'Cannot set the endpoint because a model or an endpoint has already been set',
            });
        }

        this.region = region;
        return this;
    }
}
