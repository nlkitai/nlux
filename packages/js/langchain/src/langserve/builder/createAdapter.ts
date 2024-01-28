import {LangServeAdapterBuilder} from './builder';
import {LangServeAdapterBuilderImpl} from './builderImpl';

export const createAdapter = (): LangServeAdapterBuilder => new LangServeAdapterBuilderImpl();
