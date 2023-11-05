import {NluxUsageError} from '@nlux/nlux';

import {OpenAIGptAbstractBuilder} from './openai/gpt/builders/abstractBuilder';
import {OpenAIGptStreamingBuilder} from './openai/gpt/builders/streamingBuilder';

const source = 'createAdapter';

export type ProvidedAdapterType = 'openai/gpt';

export const createAdapter = (adapterType: ProvidedAdapterType): OpenAIGptAbstractBuilder => {
    if (adapterType !== 'openai/gpt') {
        throw new NluxUsageError({
            source,
            message: 'Adapter type not supported',
        });
    }

    return new OpenAIGptStreamingBuilder();
};
