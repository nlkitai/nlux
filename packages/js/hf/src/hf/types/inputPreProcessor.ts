import {ChatAdapterOptions} from './chatAdapterOptions';

export type HfInputPreProcessor = (
    input: string,
    adapterOptions: Readonly<ChatAdapterOptions>,
) => string;
