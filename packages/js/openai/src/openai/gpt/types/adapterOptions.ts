import {DataTransferMode} from '@nlux/core';
import {OpenAIModel} from './model';

export type OpenAiAdapterOptions = {
    dataTransferMode?: DataTransferMode;
    model?: OpenAIModel;
    apiKey: string;
    systemMessage?: string;
};
