import {ContextAdapterBuilder} from './builder/builder';
import {ContextAdapterBuilderImpl} from './builder/builderImpl';

export const createContextAdapter = (): ContextAdapterBuilder => {
    return new ContextAdapterBuilderImpl();
};
