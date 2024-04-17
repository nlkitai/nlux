import {StandardChatAdapter} from './standardChatAdapter';

/**
 * The base interface for creating a new instance of a StandardChatAdapter.
 * Adapter builders can extend this interface to add additional methods for configuration.
 */
export interface ChatAdapterBuilder<AiMsg> {
    create(): StandardChatAdapter<AiMsg>;
}
