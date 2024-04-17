import {ContextDataAdapter} from './contextDataAdapter';
import {ContextTasksAdapter} from './contextTasksAdapter';

/**
 * The context adapter context-aware chat experience and AI assistants.
 * This type provides the methods for both context data and tasks that should be implemented by adapters
 * in order to synchronize data related to the context between the frontend and the backend.
 *
 * If your chat experience does not require the execution of tasks, you can use the ContextDataAdapter type instead.
 * But if you need the LLM to execute tasks, as well as access the context data, you should use the ContextAdapter type
 * to implement both the context data and tasks.
 */
export interface ContextAdapter extends ContextDataAdapter, ContextTasksAdapter {
}
