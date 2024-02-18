import {NlBridgeAdapterBuilder} from './builder';
import {NlBridgeAdapterBuilderImpl} from './builderImpl';

export const createAdapter = (): NlBridgeAdapterBuilder => new NlBridgeAdapterBuilderImpl();
