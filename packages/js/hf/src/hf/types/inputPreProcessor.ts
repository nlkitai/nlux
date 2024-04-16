import {ChatAdapterOptions} from './chatAdapterOptions';

export type HfInputPreProcessor<AiMsg> = (
    input: string,
    adapterOptions: Readonly<ChatAdapterOptions<AiMsg>>,
) => string;
