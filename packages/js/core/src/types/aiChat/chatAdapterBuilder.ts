import {StandardChatAdapter} from './standardChatAdapter';

export interface ChatAdapterBuilder {
    create(): StandardChatAdapter;
}
