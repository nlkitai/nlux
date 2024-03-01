import {ContextAdapter} from '../aiContext/contextAdapter';

export interface AssistantAdapterBuilder {
    create(): ContextAdapter;
}
