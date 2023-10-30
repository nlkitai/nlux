import {AdapterConfig, AdapterInfo} from '@nlux/nlux';
import OpenAI from 'openai';
import {decode as fetchDecode} from './codec/fetch/decode';
import {encode as fetchEncode} from './codec/fetch/encode';
import {decode as streamDecode} from './codec/stream/decode';
import {encode as streamEncode} from './codec/stream/encode';

export const gptStreamingAdapterConfig: AdapterConfig<
    OpenAI.Chat.Completions.ChatCompletionChunk,
    OpenAI.Chat.Completions.ChatCompletionMessageParam
> = Object.freeze({
    encodeMessage: streamEncode,
    decodeMessage: streamDecode,
});

export const gptFetchAdapterConfig: AdapterConfig<
    OpenAI.Chat.Completions.ChatCompletion,
    OpenAI.Chat.Completions.ChatCompletionMessageParam
> = Object.freeze({
    encodeMessage: fetchEncode,
    decodeMessage: fetchDecode,
});

export const info: AdapterInfo = {
    id: 'nlux-gpt-adapter',
    connectionType: 'http',
    capabilities: {
        textChat: true,
        audio: false,
        fileUpload: false,
        replyToSingleMessage: false,
    },
    remote: {
        url: 'https://api.openai.com/v1/chat/completion',
    },
    inputFormats: ['text'],
    outputFormats: ['text'],
};

export const gptAdapterInfo = Object.freeze(info) as AdapterInfo;
