import {ChatAdapterBuilder} from './builder';
import {LangServeAdapterBuilderImpl} from './builderImpl';

export const createChatAdapter = <AiMsg = string>(): ChatAdapterBuilder<AiMsg> => {
    return new LangServeAdapterBuilderImpl();
};
