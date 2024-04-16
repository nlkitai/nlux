import {ChatAdapterOptions} from './chatAdapterOptions';

export type HfInputPreProcessor<MessageType> = (
    input: string,
    adapterOptions: Readonly<ChatAdapterOptions<MessageType>>,
) => string;
