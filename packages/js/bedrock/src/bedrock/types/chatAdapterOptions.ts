import {BedrockRuntimeClientConfigType, InferenceConfiguration} from '@aws-sdk/client-bedrock-runtime';
import {DataTransferMode} from '@nlux/core';

export type ChatAdapterOptions = {
    dataTransferMode?: DataTransferMode;
    model: string;

    inferenceConfig?: InferenceConfiguration;
} & BedrockRuntimeClientConfigType;
