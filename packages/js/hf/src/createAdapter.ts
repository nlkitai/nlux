import {HfAdapterBuilder} from './hf/builder/builder';
import {AdapterBuilderImpl} from './hf/builder/builderImpl';

export const createAdapter = (): HfAdapterBuilder => new AdapterBuilderImpl();
