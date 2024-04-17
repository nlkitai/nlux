import {ContextActionResult, SetContextResult} from '../../aiContext/contextResults';
import {ContextItems} from '../../aiContext/data';
import {ContextAdapterExtras} from './contextAdapterExtras';

/**
 * The context data adapter is responsible for synchronizing the context data between the frontend application
 * and the backend system. In order to build a context-aware chat experience and AI assistants, the context
 * adapter should be used.
 *
 * nlux does not set any restrictions on the context data structure or where and how the data should be stored,
 * but it expects the backend system responsible for generating the chat responses to be able to access the
 * context data as needed.
 *
 * The goal of the context this adapter is to facilitate providing the context data to the backend.
 * The following methods are expected to be implemented by the context data adapter:
 *
 * - Set context data: On initial load, the context data should be set to the initial state.
 * - Get context data: Data loaded from the backend.
 * - Update context data: Called when the context data is updated.
 * - Clear context data: When the app is closed or the user logs out, the context data should be cleared.
 */
export interface ContextDataAdapter {
    /**
     * Creates a new context and sets the initial context data when provided.
     * On success, the new context ID should be returned.
     *
     * @param {Object} initialData
     * @param {ContextAdapterExtras} extras
     * @returns {Promise<SetContextResult>}
     */
    create: (
        initialItems?: ContextItems,
        extras?: ContextAdapterExtras,
    ) => Promise<SetContextResult>;

    /**
     * Deletes the context data and any registered tasks for the given context ID, and makes the context ID invalid.
     * This method should be used when the context is no longer needed.
     *
     * @param {string} contextId
     * @param {ContextAdapterExtras} extras
     * @returns {Promise<ContextActionResult>}
     */
    discard: (
        contextId: string,
        extras?: ContextAdapterExtras,
    ) => Promise<ContextActionResult>;

    /**
     * Deletes the data for the given context ID and item IDs.
     *
     * @param {string} contextId The context ID.
     * @param {string[]} itemIds The item IDs to delete.
     * @param {ContextAdapterExtras} extras
     * @returns {Promise<ContextActionResult>}
     */
    removeItems: (
        contextId: string,
        itemIds: string[],
        extras?: ContextAdapterExtras,
    ) => Promise<ContextActionResult>;

    /**
     * Resets the context data for the given context ID.
     * If no new context data is not provided, the context will be emptied.
     * If new context data is provided, it will replace the existing context data.
     *
     * @param {string} contextId
     * @param {ContextItems} newData
     * @param {ContextAdapterExtras} extras
     * @returns {Promise<ContextActionResult>}
     */
    resetItems: (
        contextId: string,
        newData?: ContextItems,
        extras?: ContextAdapterExtras,
    ) => Promise<ContextActionResult>;

    /**
     * Updates data for the given context ID.
     *
     *
     * @param {string} contextId
     * @param {string} itemId
     * @param {Object} data
     * @param {ContextAdapterExtras} extras
     * @returns {Promise<ContextActionResult>}
     */
    updateItems: (
        contextId: string,
        itemsToUpdate: Partial<ContextItems>,
        extras?: ContextAdapterExtras,
    ) => Promise<ContextActionResult>;
}
