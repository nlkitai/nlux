import {HfInputPreProcessor} from '../types/inputPreProcessor';
import {HfOutputPreProcessor} from '../types/outputPreProcessor';

export const llama2InputPreProcessor: HfInputPreProcessor = (
    input,
    adapterOptions,
) => {
    const systemMessage = adapterOptions?.systemMessage
        ?? 'You are a helpful assistant. You keep your answers short.';

    return (
        `<s> [INST] <<SYS>> ${systemMessage} <</SYS>> </s>` +
        `<s> [INST] ${input} [/INST]`
    );
};

export const llama2OutputPreProcessor: HfOutputPreProcessor = (
    output,
) => {
    // Strip any HTML-like tags from the output
    if (!output) {
        return '';
    }

    return output.replace(/<[^>]*>/g, '');
};