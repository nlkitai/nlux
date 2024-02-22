import {AiContextAdapter} from '../aiContext/adapter';

export interface AssistantAdapterBuilder {
    create(): AiContextAdapter;
}
