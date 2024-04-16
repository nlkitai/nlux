import {ChatAdapterBuilder} from './builder';
import {ChatAdapterBuilderImpl} from './builderImpl';

export const createChatAdapter = <AiMsg>(): ChatAdapterBuilder<AiMsg> => new ChatAdapterBuilderImpl<AiMsg>();
