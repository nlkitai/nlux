import {ChatAdapterBuilder} from './builder';
import {ChatAdapterBuilderImpl} from './builderImpl';

export const createChatAdapter = (): ChatAdapterBuilder => new ChatAdapterBuilderImpl();
