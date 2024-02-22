import {ChatAdapterBuilder} from './builder';
import {NlBridgeAdapterBuilderImpl} from './builderImpl';

export const createChatAdapter = (): ChatAdapterBuilder => new NlBridgeAdapterBuilderImpl();
