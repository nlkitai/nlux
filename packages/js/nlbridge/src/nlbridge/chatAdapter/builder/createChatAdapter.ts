import {ChatAdapterBuilder} from './builder';
import {ChatAdapterBuilderImpl} from './builderImpl';

export const createChatAdapter = <AiMsg = string>(): ChatAdapterBuilder<AiMsg> => {
    return new ChatAdapterBuilderImpl<AiMsg>();
};
