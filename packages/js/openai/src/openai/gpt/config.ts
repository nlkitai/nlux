import {StandardAdapterInfo} from '@nlux/core';

export const info: StandardAdapterInfo = {
    id: 'nlux-openai-adapter',
    capabilities: {
        chat: true,
        fileUpload: false,
        speechToText: false,
        textToSpeech: false,
    },
};

export const gptAdapterInfo = Object.freeze(info) as StandardAdapterInfo;
