import {OpenAIChatModel} from '@nlux/openai';

export type OpenAIUseAdapterOptions = {
    apiKey: string;
    dataExchangeMode?: 'stream' | 'fetch';
    initialSystemMessage?: string;
    model?: OpenAIChatModel,
};
