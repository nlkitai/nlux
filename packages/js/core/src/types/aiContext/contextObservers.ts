import {ContextItemDataType} from './data';

export interface ContextDomElementHandler {
    destroy(): void;
}

/**
 * Once a context state item is registered, a state item handler with this interface will be created.
 * This handler will be used to update the state item's data and to destroy it when it is no longer needed.
 * It can also be used to change the description of the state item.
 */
export interface ContextItemHandler {
    /**
     * Once the state item is no longer needed, it should be discarded. This method should be called to destroy the
     * state item. By doing so, the state item will be removed from the context and will no longer be used by the AI.
     */
    discard(): void;

    /**
     * This method is used to update the state item's data. The data is used by the AI to answer context-aware queries.
     * For example, if the user asks the AI about the logged-in user, the AI will use the data to provide the answer.
     * The data should be kept up-to-date to ensure that the AI provides accurate answers.
     *
     * @param {ContextItemDataType} data The new data to be used for the context state item.
     */
    setData(data: ContextItemDataType): void;

    /**
     * When a state item is registered, a description is provided.
     * That description is used by AI to determine how and it what context the state item is used.
     * For example, when the user queries the AI about a specific data in the page, the description will be used to
     * determine which context state items are relevant to the query, and thus it should always be up-to-date.
     *
     * This method can be used to change the description of the state item when the usage of the state item changes.
     * For example, the logged-in user in a marketplace app can be either a buyer or a seller, when they switch from
     * one role to another, the description of the state item should be updated to reflect the new role.
     *
     * @param {string} description
     */
    setDescription(description: string): void;
}

/**
 * Once a context task is registered, a task handler with this interface will be created.
 * This handler will be used to update the task's data, callback, and to destroy it when it is no longer needed.
 * It can also be used to change the description of the task and the descriptions of its parameters.
 */
export interface ContextTaskHandler {
    discard(): void;
    setCallback(callback: Function): void;
    setDescription(description: string): void;
    setParamDescriptions(paramDescriptions: string[]): void;
}
