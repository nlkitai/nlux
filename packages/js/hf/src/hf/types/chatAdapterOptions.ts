import {DataTransferMode} from '@nlux/core';
import {HfInputPreProcessor} from './inputPreProcessor';
import {HfOutputPreProcessor} from './outputPreProcessor';

export type ChatAdapterOptions<MessageType> = {
    dataTransferMode?: DataTransferMode;
    model?: string;
    endpoint?: string;
    authToken?: string;
    preProcessors?: {
        input?: HfInputPreProcessor<MessageType>;
        output?: HfOutputPreProcessor<MessageType>;
    };
    maxNewTokens?: number;
    systemMessage?: string;
};
