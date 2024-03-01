import {ChatAdapterBuilder} from './hf/builder/builder';
import {ChatAdapterBuilderImpl} from './hf/builder/builderImpl';

export const createChatAdapter = (): ChatAdapterBuilder => new ChatAdapterBuilderImpl();
