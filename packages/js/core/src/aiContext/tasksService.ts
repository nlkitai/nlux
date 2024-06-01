import {ContextTasksAdapter} from '../../../../shared/src/types/adapters/context/contextTasksAdapter';
import {
    ContextActionResult,
    DestroyContextResult,
    RunTaskResult,
} from '../../../../shared/src/types/aiContext/contextResults';
import {ContextTask, ContextTasks} from '../../../../shared/src/types/aiContext/data';
import {CallbackArgType, CallbackFunction} from '../../../../shared/src/types/callbackFunction';
import {warn} from '../../../../shared/src/utils/warn';

type UpdateQueueItem = {
    operation: 'set';
    description: string;
    paramDescriptions: string[];
    callback: CallbackFunction;
} | {
    operation: 'update';
    description?: string;
    paramDescriptions?: string[];
    callback?: CallbackFunction;
} | {
    operation: 'delete';
};

export class TasksService {
    private actionToPerformWhenIdle: 'flush' | 'reset' | 'none' = 'none';
    private adapter: ContextTasksAdapter;
    private readonly contextId: string;
    private status: 'idle' | 'updating' | 'destroyed' = 'idle';
    private readonly taskCallbacks: Map<string, CallbackFunction> = new Map();
    private readonly tasks: Set<string> = new Set();
    private readonly updateQueueByTaskId: Map<string, UpdateQueueItem> = new Map();

    constructor(contextId: string, adapter: ContextTasksAdapter) {
        this.contextId = contextId;
        this.adapter = adapter;
    }

    canRunTask(taskId: string): boolean {
        return this.taskCallbacks.has(taskId);
    }

    async destroy(): Promise<DestroyContextResult> {
        if (this.status === 'destroyed') {
            warn(`Context.TasksService.destroy() called on a state that has already been destroyed`);
            return {
                success: true,
            };
        }

        this.status = 'updating';
        await this.unregisterAllTasks();

        this.status = 'destroyed';
        this.updateQueueByTaskId.clear();
        this.tasks.clear();

        return {
            success: true,
        };
    }

    async flush(): Promise<void> {
        if (this.status === 'updating') {
            this.actionToPerformWhenIdle = 'flush';
            return;
        }

        const itemsInQueue = this.updateQueueByTaskId.keys();
        const tasksToSet: string[] = [];
        const tasksToUpdate: string[] = [];
        const tasksToDelete: string[] = [];

        for (const itemId of itemsInQueue) {
            const item = this.updateQueueByTaskId.get(itemId);
            if (!item) {
                continue;
            }

            if (item.operation === 'delete') {
                tasksToDelete.push(itemId);
                continue;
            }

            if (item.operation === 'set') {
                tasksToSet.push(itemId);
                continue;
            }

            if (item.operation === 'update') {
                tasksToUpdate.push(itemId);

            }
        }

        if (tasksToSet.length === 0 && tasksToUpdate.length === 0 && tasksToDelete.length === 0) {
            return;
        }

        // At least one item is in the queue, so we need to update the context.
        this.status = 'updating';

        const itemsToSetByItemIdData = this.buildUpdateObject(tasksToSet);
        const itemsToUpdateByItemIdData = this.buildUpdateObject(tasksToUpdate);
        const allItemsToUpdate = {
            ...itemsToSetByItemIdData,
            ...itemsToUpdateByItemIdData,
        };

        if (Object.keys(allItemsToUpdate).length > 0) {
            try {
                const registerTasksResult = await this.adapter.updateTasks(
                    this.contextId, allItemsToUpdate,
                );

                if (!registerTasksResult.success) {
                    warn(
                        `Context.TasksService.flush() failed to register tasks for context ID ${this.contextId}\n` +
                        `Error: ${registerTasksResult.error}`,
                    );
                } else {
                    for (const taskId of Object.keys(allItemsToUpdate)) {
                        const queuedTask = this.updateQueueByTaskId.get(taskId);
                        if (queuedTask && queuedTask.operation === 'set') {
                            this.taskCallbacks.set(taskId, queuedTask.callback);
                            this.updateQueueByTaskId.delete(taskId);
                        }
                    }
                }
            } catch (error) {
                warn(
                    `Context.TasksService.flush() failed to register tasks for context ID ${this.contextId}\n` +
                    `Error: ${error}`,
                );
            }
        }

        if (tasksToDelete.length > 0) {
            try {
                const unregisterTasksResult = await this.adapter.removeTasks(
                    this.contextId, tasksToDelete,
                );

                if (!unregisterTasksResult.success) {
                    warn(
                        `Context.TasksService.flush() failed to unregister tasks for context ID ${this.contextId}\n` +
                        `Error: ${unregisterTasksResult.error}`,
                    );
                } else {
                    for (const taskId of tasksToDelete) {
                        this.taskCallbacks.delete(taskId);
                        this.updateQueueByTaskId.delete(taskId);
                    }
                }
            } catch (error) {
                warn(
                    `Context.TasksService.flush() failed to unregister tasks for context ID ${this.contextId}\n` +
                    `Error: ${error}`,
                );
            }
        }

        await this.backToIdle();
    }

    hasTask(taskId: string): boolean {
        return this.tasks.has(taskId);
    }

    async registerTask(
        taskId: string,
        description: string,
        callback: CallbackFunction,
        paramDescriptions?: string[],
    ): Promise<void> {
        if (this.status === 'destroyed') {
            throw new Error('Context has been destroyed');
        }

        if (this.tasks.has(taskId)) {
            throw new Error(`A task with ID \'${taskId}\' already exists. Task IDs must be unique.`);
        }

        this.updateQueueByTaskId.set(taskId, {
            operation: 'set',
            description,
            paramDescriptions: paramDescriptions || [],
            callback,
        });

        this.tasks.add(taskId);
    }

    async resetContextData(): Promise<void> {
        const victimContextId = this.contextId;

        this.tasks.clear();
        this.taskCallbacks.clear();
        this.updateQueueByTaskId.clear();

        if (this.status === 'updating') {
            this.actionToPerformWhenIdle = 'reset';
            return;
        }

        if (!victimContextId) {
            warn(`resetContextData() called with no contextId!`);
            await this.backToIdle();
            return;
        }

        try {
            this.status = 'updating';
            await this.unregisterAllTasks();
        } catch (error) {
            warn(`Failed to reset context data: ${error}`);
            // TODO - Handle retry on failure.
        }

        await this.backToIdle();
    }

    async runTask(taskId: string, parameters?: Array<unknown>): Promise<RunTaskResult> {
        if (this.status === 'destroyed') {
            throw new Error('Context has been destroyed');
        }

        if (!this.tasks.has(taskId)) {
            return {
                success: false,
                error: `Task with ID ${taskId} not found`,
            };
        }

        const callback = this.taskCallbacks.get(taskId);
        if (!callback) {
            return {
                success: false,
                error: `The task with ID \'${taskId}\' has no callback. This is potential due to failed registration.`,
            };
        }

        try {
            const result = callback(
                ...(parameters ?? []) as CallbackArgType[],
            );
            return {
                success: true,
                result,
            };
        } catch (error) {
            return {
                success: false,
                error: `${error}`,
            };
        }
    }

    async unregisterAllTasks(): Promise<ContextActionResult> {
        if (this.tasks.size === 0) {
            return {
                success: true,
            };
        }

        const result = await this.adapter.resetTasks(this.contextId);
        if (result.success) {
            this.tasks.clear();
            this.taskCallbacks.clear();
            this.updateQueueByTaskId.clear();
        }

        return result;
    }

    async unregisterTask(taskId: string): Promise<ContextActionResult> {
        if (this.status === 'destroyed') {
            throw new Error('Context has been destroyed');
        }

        if (!this.tasks.has(taskId)) {
            return {
                success: true,
            };
        }

        this.tasks.delete(taskId);
        this.taskCallbacks.delete(taskId);
        this.updateQueueByTaskId.set(taskId, {
            operation: 'delete',
        });

        return {
            success: true,
        };
    }

    async updateTaskCallback(taskId: string, callback: CallbackFunction): Promise<void> {
        if (this.status === 'destroyed') {
            throw new Error('The context has been destroyed');
        }

        if (!this.tasks.has(taskId)) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        this.taskCallbacks.set(taskId, callback);
    }

    async updateTaskDescription(taskId: string, description: string): Promise<void> {
        if (this.status === 'destroyed') {
            throw new Error('The context has been destroyed');
        }

        if (!this.tasks.has(taskId)) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        const item = this.updateQueueByTaskId.get(taskId);
        if (item) {
            if (item.operation !== 'update') {
                const newItem: UpdateQueueItem = {
                    operation: 'update',
                    description,
                };

                this.updateQueueByTaskId.set(taskId, newItem);
            } else {
                item.description = description;
            }
        } else {
            this.updateQueueByTaskId.set(taskId, {
                operation: 'update',
                description,
            });
        }
    }

    async updateTaskParamDescriptions(
        taskId: string, paramDescriptions: string[],
    ): Promise<void> {
        if (this.status === 'destroyed') {
            throw new Error('The context has been destroyed');
        }

        if (!this.tasks.has(taskId)) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        const item = this.updateQueueByTaskId.get(taskId);
        if (item) {
            if (item.operation !== 'update') {
                const newItem: UpdateQueueItem = {
                    operation: 'update',
                    paramDescriptions,
                };

                this.updateQueueByTaskId.set(taskId, newItem);
            } else {
                item.paramDescriptions = paramDescriptions;
            }
        } else {
            this.updateQueueByTaskId.set(taskId, {
                operation: 'update',
                paramDescriptions,
            });
        }
    }

    private async backToIdle() {
        this.status = 'idle';
        const actionToPerformWhenIdle = this.actionToPerformWhenIdle;
        this.actionToPerformWhenIdle = 'none';

        if (actionToPerformWhenIdle === 'flush') {
            await this.flush();
            return;
        }

        if (actionToPerformWhenIdle === 'reset') {
            await this.unregisterAllTasks();
            return;
        }
    }

    private buildUpdateObject(itemIds: string[]): ContextTasks {
        return itemIds.reduce(
            (acc: ContextTasks, itemId) => {
                const item = this.updateQueueByTaskId.get(itemId);
                if (!item) {
                    return acc;
                }

                if (item.operation === 'set') {
                    acc[itemId] = {
                        description: item.description,
                        paramDescriptions: item.paramDescriptions,
                    };
                }

                if (
                    item.operation === 'update' &&
                    (item.description !== undefined || item.paramDescriptions !== undefined)
                ) {
                    const updateData: Partial<ContextTask> = {};
                    if (item.description !== undefined) {
                        updateData.description = item.description;
                    }

                    if (item.paramDescriptions !== undefined) {
                        updateData.paramDescriptions = item.paramDescriptions;
                    }

                    acc[itemId] = updateData as ContextTask;
                }

                return acc;
            },
            {},
        );
    }
}
