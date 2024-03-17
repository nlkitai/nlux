import {DataTransferMode} from '@nlux/core';
import {OpenAiModel} from './model';

export type ChatAdapterOptions = {
    useAs?: DataTransferMode;
    model?: OpenAiModel;
    apiKey: string;
    systemMessage?: string;
};
