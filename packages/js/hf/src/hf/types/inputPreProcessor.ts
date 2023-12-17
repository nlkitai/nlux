import {HfAdapterOptions} from './adapterOptions';

export type HfInputPreProcessor = (
    input: string,
    adapterOptions: Readonly<HfAdapterOptions>,
) => string;
