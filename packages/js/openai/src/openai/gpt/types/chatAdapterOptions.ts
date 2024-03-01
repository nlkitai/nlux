import {DataTransferMode} from '@nlux/core';
import {OpenAiModel} from './model';

export type ChatAdapterOptions = {
    dataTransferMode?: DataTransferMode;
    model?: OpenAiModel;
    apiKey: string;
    systemMessage?: string;
};
