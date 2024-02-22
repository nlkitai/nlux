import {useContext} from 'react';
import {AiContext} from '../types/AiContext';

export type UpdateContextItem = (data: any) => void;
export type ClearContextItem = () => void;

export type RegisterAiTask = (id: string, callback: Function, parametersDescription: string[]) => {
    cancel: () => void;
};

export type UnregisterAiTask = (id: string) => void;

export const useAiContext = (
    aiContext: AiContext,
    propertyKey: string,
): {
    update: UpdateContextItem,
    clear: ClearContextItem,
    registerTask: RegisterAiTask,
    unregisterTask: UnregisterAiTask,
} => {
    const {
        adapter,
        contextId,
        registeredTaskCallbacks,
    } = useContext(aiContext.ref);

    const update = (data: any) => {
        // TODO - Improve + Batch updates
        adapter.update(contextId, {
            [propertyKey]: data,
        }).then((result) => {
            // TODO - Handle error
        }).catch(() => {
            // TODO - Handle exception
        });
    };

    const clear = () => {
        // TODO - Improve + Batch updates
        adapter.update(contextId, {
            [propertyKey]: null,
        }).then(() => {
            // TODO - Handle error
        }).catch(() => {
            // TODO - Handle exception
        });
    };

    const registerTask: RegisterAiTask = (taskId, callback, parametersDescription) => {
        let cancelled = false;
        adapter.registerTask(contextId, taskId, parametersDescription).then((result) => {
            if (result.success && !cancelled) {
                registeredTaskCallbacks[taskId] = callback;
            }
        }).catch(() => {
            // TODO - Handle exception
        });

        return {
            cancel: () => {
                cancelled = true;
                unregisterTask(taskId);
            },
        };
    };

    const unregisterTask = (id: string) => {
        adapter.unregisterTask(contextId, id).then(() => {
            // TODO - Handle unregister
            delete registeredTaskCallbacks[id];
        }).catch(() => {
            // TODO - Handle exception
        });
    };

    return {
        update,
        clear,
        registerTask,
        unregisterTask,
    };
};
