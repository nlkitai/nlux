import {HfAdapterOptions} from './adapterOptions';

export type HfInputPreProcessor = (
    input: string,
    memorizedConversation: Record<string, string> | null,
    adapterOptions: Readonly<HfAdapterOptions>,
) => string;
