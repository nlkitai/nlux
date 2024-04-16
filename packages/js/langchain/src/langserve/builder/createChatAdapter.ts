import {ChatAdapterBuilder} from './builder';
import {LangServeAdapterBuilderImpl} from './builderImpl';

export const createChatAdapter = function <AiMsg>(): ChatAdapterBuilder<AiMsg> {
    return new LangServeAdapterBuilderImpl();
};
