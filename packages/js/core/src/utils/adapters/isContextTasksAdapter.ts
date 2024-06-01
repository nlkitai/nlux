import {ContextTasksAdapter} from '@shared/types/adapters/context/contextTasksAdapter';

export const isContextTasksAdapter = (adapter: unknown): ContextTasksAdapter | false => {
    const typedAdapter = adapter as Partial<ContextTasksAdapter> | undefined;
    if (
        typedAdapter &&
        typeof typedAdapter.resetTasks === 'function' &&
        typeof typedAdapter.updateTasks === 'function' &&
        typeof typedAdapter.removeTasks === 'function'
    ) {
        return typedAdapter as ContextTasksAdapter;
    }

    return false;
};
