import {ContextAdapter} from './contextAdapter';

/**
 * This represents the base interface for the context adapter builders.
 * The create method should be implemented to return a new instance of the context adapter.
 * Additional methods can be added to the builder to configure the context adapter via chaining.
 */
export interface ContextAdapterBuilder {
    build(): ContextAdapter;
}
