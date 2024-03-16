import {ContextActionResult} from '../../aiContext/contextResults';
import {ContextTasks} from '../../aiContext/data';
import {ContextAdapterExtras} from './contextAdapterExtras';

/**
 * The context tasks adapter is responsible for registering and unregistering tasks that can be triggered by
 * the AI assistant. The tasks are front-end specific but can be triggered by backend based on specific user
 * prompts in the AI chat. In order to build a context-aware chat experience that can also trigger front-end
 * tasks, the context tasks adapter should be used to let the backend know about the tasks that can be triggered.
 *
 * The following methods are expected to be implemented by the context tasks adapter:
 *
 * - Register task: When a new screen is loaded, or a specific state is reached, a new task can be registered.
 * - Unregister task: When the screen is closed or the state is no longer valid, the task should be unregistered.
 */
export interface ContextTasksAdapter {
    /**
     * Unregisters specific tasks from the given context ID, based on their task IDs.
     *
     * @param {string} contextId
     * @param {string} taskIds[]
     * @param {ContextAdapterExtras} extras
     * @returns {Promise<ContextActionResult>}
     */
    removeTasks: (
        contextId: string,
        taskIds: string[],
        extras?: ContextAdapterExtras,
    ) => Promise<ContextActionResult>;

    /**
     * Resets the tasks for the given context ID.
     * If new tasks are provided, they will replace the existing tasks.
     * If no tasks are provided, all the tasks will be emptied.
     *
     * @param {string} contextId
     * @param {ContextAdapterExtras} extras
     * @returns {Promise<ContextActionResult>}
     */
    resetTasks: (
        contextId: string,
        newTasks?: ContextTasks,
        extras?: ContextAdapterExtras,
    ) => Promise<ContextActionResult>;

    /**
     * Updates the tasks included in the `tasks` object, for the given context ID.
     * Tasks that are not included in the `tasks` object should be left unchanged.
     * If you want to remove a task, you should use the `removeTasks` method.
     *
     * @param {string} contextId
     * @param {Partial<ContextTasks>} tasks
     * @param {ContextAdapterExtras} extras
     * @returns {Promise<ContextActionResult>}
     */
    updateTasks: (
        contextId: string,
        tasks: Partial<ContextTasks>,
        extras?: ContextAdapterExtras,
    ) => Promise<ContextActionResult>;
}
