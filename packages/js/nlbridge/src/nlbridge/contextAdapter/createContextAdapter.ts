import {NlBridgeContextAdapterBuilder} from './builder/builder';
import {NlBridgeContextAdapterBuilderImpl} from './builder/builderImpl';

export const createContextAdapter = (): NlBridgeContextAdapterBuilder => {
    return new NlBridgeContextAdapterBuilderImpl();
};
