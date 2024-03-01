import {DataTransferMode} from '@nlux/core';
import {HfInputPreProcessor} from './inputPreProcessor';
import {HfOutputPreProcessor} from './outputPreProcessor';

export type ChatAdapterOptions = {
    dataTransferMode?: DataTransferMode;
    model?: string;
    endpoint?: string;
    authToken?: string;
    preProcessors?: {
        input?: HfInputPreProcessor;
        output?: HfOutputPreProcessor;
    };
    maxNewTokens?: number;
    systemMessage?: string;
};
