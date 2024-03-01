import {ChatAdapterBuilder} from './builder';
import {LangServeAdapterBuilderImpl} from './builderImpl';

export const createChatAdapter = (): ChatAdapterBuilder => new LangServeAdapterBuilderImpl();
