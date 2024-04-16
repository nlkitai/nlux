import {ChatAdapterBuilder} from './builder';
import {LangServeAdapterBuilderImpl} from './builderImpl';

export const createChatAdapter = function <MessageType>(): ChatAdapterBuilder<MessageType> {
    return new LangServeAdapterBuilderImpl();
};
