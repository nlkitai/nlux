import {DataTransferMode} from '@nlux/core';
import {HfInputPreProcessor} from './inputPreProcessor';
import {HfOutputPreProcessor} from './outputPreProcessor';

export type ChatAdapterOptions<AiMsg> = {
    dataTransferMode?: DataTransferMode;
    model?: string;
    endpoint?: string;
    authToken?: string;
    preProcessors?: {
        input?: HfInputPreProcessor<AiMsg>;
        output?: HfOutputPreProcessor<AiMsg>;
    };
    maxNewTokens?: number;
    systemMessage?: string;
};
