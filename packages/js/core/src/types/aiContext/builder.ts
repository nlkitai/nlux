import {AiContextAdapter} from './adapter';

export interface ContextAdapterBuilder {
    create(): AiContextAdapter;
}
