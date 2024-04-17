import {ChatAdapterBuilder} from './builder';
import {ChatAdapterBuilderImpl} from './builderImpl';

export const createChatAdapter = <AiMsg = string>(): ChatAdapterBuilder<AiMsg> => new ChatAdapterBuilderImpl<AiMsg>();
