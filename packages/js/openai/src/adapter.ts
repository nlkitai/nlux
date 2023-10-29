import {NluxUsageError} from '@nlux/nlux';
import {OpenAiGpt4Builder} from './openai/gpt4/builders/builder';

const source = 'createAdapter';

export type ProvidedAdapterType = 'openai/gpt4';

export const createAdapter = (adapterType: ProvidedAdapterType): OpenAiGpt4Builder => {
    if (adapterType !== 'openai/gpt4') {
        throw new NluxUsageError({
            source,
            message: 'Adapter type not supported',
        });
    }

    return new OpenAiGpt4Builder();
};
