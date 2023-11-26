import {DataTransferMode} from '@nlux/nlux';
import {OpenAIModel} from './model';

export type OpenAiAdapterOptions = {
    dataTransferMode?: DataTransferMode;
    model?: OpenAIModel;
    apiKey: string;
    systemMessage?: string;
};
