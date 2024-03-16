import {ContextTasksAdapter} from '../../types/adapters/context/contextTasksAdapter';

export const isContextTasksAdapter = (adapter: any): ContextTasksAdapter | false => {
    if (
        adapter &&
        typeof adapter.resetTasks === 'function' &&
        typeof adapter.updateTasks === 'function' &&
        typeof adapter.removeTasks === 'function'
    ) {
        return adapter;
    }

    return false;
};
