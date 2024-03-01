import {ContextAdapter} from './contextAdapter';

export interface ContextAdapterBuilder {
    create(): ContextAdapter;
}
