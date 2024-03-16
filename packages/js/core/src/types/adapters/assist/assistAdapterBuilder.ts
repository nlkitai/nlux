import {AssistAdapter} from './assistAdapter';

/**
 * The base interface for creating a new instance of a StandardChatAdapter.
 * Adapter builders can extend this interface to add additional methods for configuration.
 */
export interface AssistAdapterBuilder {
    /**
     * Create a new instance of an AssistAdapter.
     */
    create(): AssistAdapter;
}
