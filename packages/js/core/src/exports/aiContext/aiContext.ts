import {ContextAdapter} from '../../types/adapters/context/contextAdapter';
import {ContextAdapterBuilder} from '../../types/adapters/context/contextAdapterBuilder';
import {ContextTasksAdapter} from '../../types/adapters/context/contextTasksAdapter';
import {AiContext, AiContextItemStatus, AiContextStatus} from '../../types/aiContext/aiContext';
import {ContextItemHandler, ContextTaskHandler} from '../../types/aiContext/contextObservers';
import {
    ContextActionResult,
    DestroyContextResult,
    FlushContextResult,
    InitializeContextResult,
    RunTaskResult,
} from '../../types/aiContext/contextResults';
import {ContextItemDataType, ContextItems} from '../../types/aiContext/data';
import {isContextTasksAdapter} from '../../utils/adapters/isContextTasksAdapter';
import {warn} from '../../utils/warn';
import {DataSyncService} from './dataSyncService';
import {DataSyncOptions} from './options/dataSyncOptions';
import {TasksService} from './tasksService';

/**
 * Default implementation of the AiContext.
 * This class is responsible for managing the context and its observers.
 */
class AiContextImpl implements AiContext {

    public destroy = async (): Promise<DestroyContextResult> => {
        if (this.theStatus === 'destroyed') {
            return {
                success: true,
            };
        }

        // We immediately set the status to 'destroyed' to prevent the context from being used.
        // This is to prevent any use of the context while it is being destroyed, including any ongoing data sync
        // or initialization.
        this.theStatus = 'destroyed';

        // TODO - Handle error recovery and retry
        await Promise.all([
            this.theDataSyncService?.destroy(),
            this.theTasksService?.destroy(),
        ]);

        this.theDataSyncService = null;
        this.theTasksService = null;

        this.theDataAdapter = null;
        this.theTasksAdapter = null;

        return {
            success: true,
        };
    };

    public flush = async (): Promise<FlushContextResult> => {
        try {
            await this.theDataSyncService?.flush();
        } catch (error) {
            return {
                success: false,
                error: 'Failed to flush context data',
            };
        }

        try {
            await this.theTasksService?.flush();
        } catch (error) {
            return {
                success: false,
                error: 'Failed to flush context tasks',
            };
        }

        return {
            success: true,
        };
    };

    public initialize = async (data?: ContextItems): Promise<InitializeContextResult> => {
        // Among the possible context statuses: 'idle' | 'initializing' | 'syncing' | 'error' | 'destroyed'
        // Initialization cannot happen when the context is 'idle'.

        if (this.theStatus === 'initializing') {
            warn(
                `${this.constructor.name}.initialize() called while context is still initializing! ` +
                `You cannot initialize twice at the same time. Use ${this.constructor.name}.status or await ` +
                `${this.constructor.name}.initialize() to make sure that the context is not initializing before ` +
                `calling this method.`,
            );

            return {
                success: false,
                error: 'Context is still initializing! Use AiContext.status to check the context status ' +
                    'before calling this method.',
            };
        }

        if (this.theStatus === 'syncing') {
            warn(
                `${this.constructor.name}.initialize() called on an already initialized context! ` +
                `Use ${this.constructor.name}.status to check the context status before calling this method. `,
            );

            return {
                success: false,
                error: 'Context already initialized! Use AiContext.status to check the context status ' +
                    'before calling this method.',
            };
        }

        if (this.theStatus === 'destroyed') {
            warn(
                `${this.constructor.name}.initialize() called on destroyed context! ` +
                `Use ${this.constructor.name}.status to check the context status before calling this method. ` +
                `When the context is destroyed, it cannot be used anymore and you should create a new context.`,
            );

            return {
                success: false,
                error: 'Context has been destroyed',
            };
        }

        if (this.theStatus === 'error') {
            warn(
                `${this.constructor.name}.initialize() called on a context in error state! ` +
                `Use ${this.constructor.name}.status to check the context status before calling this method. ` +
                `When the context is in error state, it cannot be used anymore and you should create a new context.`,
            );

            // TODO - Enable recovery from error state.

            return {
                success: false,
                error: 'Context is in error state',
            };
        }

        if (!this.theDataAdapter) {
            warn(
                `Adapter not set! You must set the adapter before initializing the context. ` +
                `Use ${this.constructor.name}.withAdapter() to set the adapter before calling this method.`,
            );

            return {
                success: false,
                error: 'Adapter not set',
            };
        }

        this.theStatus = 'initializing';
        this.theDataSyncService = new DataSyncService(this.theDataAdapter);

        try {
            const result = await this.theDataSyncService.createContext(data);

            // Status can change to 'destroyed' if the context is destroyed while adapter.set is in progress.
            // In that case, we should not set the contextId and we should immediately clear the context.
            // @ts-ignore
            if (this.status === 'destroyed') {
                if (result.success) {
                    await this.theDataSyncService?.resetContextData();
                }

                return {
                    success: false,
                    error: 'Context has been destroyed',
                };
            }

            if (!result.success) {
                this.theStatus = 'error';
                return {
                    success: false,
                    error: 'Failed to initialize context',
                };
            }

            if (!this.contextId) {
                this.theStatus = 'error';
                return {
                    success: false,
                    error: 'Failed to obtain context ID',
                };
            }

            //
            // Handling the happy path, when the context is successfully initialized.
            //
            this.theStatus = 'syncing';

            if (this.theTasksAdapter) {
                this.theTasksService = new TasksService(this.contextId, this.theTasksAdapter);
            } else {
                warn(
                    'Initializing nlux AiContext without tasks adapter. The context will not handle registering and ' +
                    'executing tasks by AI. If you want to use tasks triggered by AI, you should provide an adapter ' +
                    'that implements ContextAdapter interface ' +
                    '[type ContextAdapter = ContextDataAdapter & ContextTasksAdapter]',
                );
            }

            return {
                success: true,
                contextId: result.contextId,
            };
        } catch (error) {
            this.theStatus = 'error';
            return {
                success: false,
                error: `${error}`,
            };
        }
    };

    public observeState = (
        itemId: string,
        description: string,
        initialData?: ContextItemDataType,
    ): ContextItemHandler | undefined => {
        if (this.theStatus === 'idle') {
            warn(
                `${this.constructor.name}.observeState() called on idle context! ` +
                `Use ${this.constructor.name}.status to check the context status before calling this method. ` +
                `Use ${this.constructor.name}.initialize() to initialize the context when it is not initialized.`,
            );

            return undefined;
        }

        if (this.theStatus === 'initializing') {
            warn(
                `${this.constructor.name}.observeState() called while context is still initializing! ` +
                `You cannot observe state items while the context is initializing. ` +
                `Use ${this.constructor.name}.status or await ${this.constructor.name}.initialize() to make sure ` +
                `that the context is not initializing before calling this method.`,
            );

            return undefined;
        }

        if (this.theStatus === 'destroyed') {
            warn(
                `${this.constructor.name}.observeState() called on destroyed context! ` +
                `Use ${this.constructor.name}.status to check the context status before calling this method. ` +
                `When the context is destroyed, it cannot be used anymore and you should create a new context.`,
            );

            return undefined;
        }

        // TODO - Look for a way to handle this
        this.theDataSyncService?.setItemData(itemId, description, initialData ?? null);

        return {
            setData: (data: ContextItemDataType) => {
                this.theDataSyncService?.updateItemData(itemId, undefined, data);
            },
            setDescription: (description: string) => {
                this.theDataSyncService?.updateItemData(itemId, description, undefined);
            },
            discard: () => {
                this.theDataSyncService?.removeItem(itemId);
            },
        };
    };

    public registerTask = (
        taskId: string,
        description: string,
        callback: Function,
        parameters: string[],
    ): ContextTaskHandler | undefined => {
        if (this.theStatus === 'idle') {
            warn(
                `${this.constructor.name}.registerTask() called on idle context! ` +
                `Use ${this.constructor.name}.status to check the context status before calling this method. ` +
                `Use ${this.constructor.name}.initialize() to initialize the context when it is not initialized.`,
            );

            return undefined;
        }

        if (!this.theTasksService) {
            warn(
                `${this.constructor.name}.registerTask() called on a context that has does not have tasks service! ` +
                `You should use an adapter that implements ContextTasksAdapter interface in order to register tasks. ` +
                `Use ${this.constructor.name}.withAdapter() to set the right adapter before calling this method.`,
            );

            return undefined;
        }

        if (this.theStatus === 'destroyed') {
            warn(
                `${this.constructor.name}.registerTask() called on destroyed context! ` +
                `Use ${this.constructor.name}.status to check the context status before calling this method. ` +
                `When the context is destroyed, it cannot be used anymore and you should create a new context.`,
            );

            return undefined;
        }


        let status: AiContextItemStatus = 'updating';

        if (this.theTasksService.hasTask(taskId)) {
            console.warn(
                `${this.constructor.name}.registerTask() called with existing taskId: ${taskId}! ` +
                `It's only possible to register a task once. Use ${this.constructor.name}.hasTask() to check ` +
                `if the task already exists. Use ${this.constructor.name}.registerTask() with a different taskId if ` +
                `you want to register a different task.`,
            );

            return undefined;
        }

        this.theTasksService.registerTask(taskId, description, callback, parameters)
            .then(() => {
                if (status === 'updating') {
                    status = 'set';
                }
            })
            .catch((error) => {
                warn(
                    `${this.constructor.name}.registerTask() failed to register task \'${taskId}\'!\n` +
                    `The task will be marked as deleted and will not be updated anymore.`,
                );

                // TODO - Better error handling

                if (status === 'updating') {
                    status = 'deleted';
                    this.unregisterTask(taskId);
                }
            });

        return {
            discard: () => {
                status = 'deleted';
                this.unregisterTask(taskId);
            },
            setDescription: (description: string) => {
                if (status === 'deleted') {
                    throw new Error('Task has been deleted');
                }

                status = 'updating';

                this.theTasksService?.updateTaskDescription(taskId, description)
                    .then(() => {
                        if (status === 'updating') {
                            status = 'set';
                        }
                    })
                    .catch((error) => {
                        if (status === 'updating') {
                            status = 'set';
                        }
                    });
            },
            setCallback: (callback: Function) => {
                if (status === 'deleted') {
                    throw new Error('Task has been deleted');
                }

                status = 'updating';

                this.theTasksService?.updateTaskCallback(taskId, callback)
                    .then(() => {
                        if (status === 'updating') {
                            status = 'set';
                        }
                    })
                    .catch((error) => {
                        if (status === 'updating') {
                            status = 'set';
                        }
                    });
            },
            setParamDescriptions: (paramDescriptions: string[]) => {
                if (status === 'deleted') {
                    throw new Error('Task has been deleted');
                }

                status = 'updating';

                this.theTasksService?.updateTaskParamDescriptions(
                    taskId, paramDescriptions,
                )
                    .then(() => {
                        if (status === 'updating') {
                            status = 'set';
                        }
                    })
                    .catch((error) => {
                        if (status === 'updating') {
                            status = 'set';
                        }
                    });
            },
        };
    };

    public reset = async (data?: ContextItems): Promise<ContextActionResult> => {
        if (!this.theDataSyncService) {
            warn(
                `${this.constructor.name}.reset() called on a state that has not been initialized! ` +
                `Use ${this.constructor.name}.initialize() to initialize the context before attempting any reset.`,
            );

            return {
                success: false,
                error: 'Context has not been initialized',
            };
        }

        try {
            await this.theDataSyncService?.resetContextData(data);
            await this.theTasksService?.resetContextData();
            this.theStatus = 'syncing';

            return {
                success: true,
            };
        } catch (error) {
            // TODO - Handle retry and error recovery
            this.theStatus = 'error';
            return {
                success: false,
                error: `${error}`,
            };
        }
    };

    public runTask = async (taskId: string, parameters?: Array<any>): Promise<RunTaskResult> => {
        if (!this.theTasksService) {
            warn(
                `${this.constructor.name}.runTask() called on a state that has not been initialized! ` +
                `Use ${this.constructor.name}.initialize() to initialize the context before attempting any task ` +
                `execution.`,
            );

            return Promise.resolve({
                success: false,
                error: 'Context has not been initialized with tasks service. An adapter that implements ' +
                    'ContextTasksAdapter interface should be provided to the context, and the context should be ' +
                    'initialized before running any tasks.',
            });
        }

        return this.theTasksService.runTask(taskId, parameters);
    };
    public withAdapter = (
        adapter: ContextAdapterBuilder | ContextAdapter,
    ): AiContext => {
        if (this.theDataAdapter) {
            throw new Error('Adapter already set');
        }

        const isBuilder = typeof (adapter as any)?.build === 'function';
        if (isBuilder) {
            this.theDataAdapter = (adapter as ContextAdapterBuilder).build();
        } else {
            this.theDataAdapter = adapter as ContextAdapter;
        }

        const adapterAsTaskAdapter = isContextTasksAdapter(this.theDataAdapter);
        if (adapterAsTaskAdapter) {
            this.theTasksAdapter = adapterAsTaskAdapter;
        }

        return this;
    };

    public withDataSyncOptions = (
        options: DataSyncOptions,
    ): AiContext => {
        if (this.theDataSyncOptions) {
            throw new Error('Data sync options already set');
        }

        this.theDataSyncOptions = {...options};
        return this;
    };

    private theDataAdapter: ContextAdapter | null = null;
    private theDataSyncOptions: DataSyncOptions | null = null;
    private theDataSyncService: DataSyncService | null = null;
    private theStatus: AiContextStatus = 'idle';
    private theTasksAdapter: ContextTasksAdapter | null = null;
    private theTasksService: TasksService | null = null;

    private unregisterTask = (taskId: string): Promise<ContextActionResult> => {
        if (!this.theTasksService) {
            warn(
                `${this.constructor.name}.unregisterTask() called on a state that has not been initialized! ` +
                `Use ${this.constructor.name}.initialize() to initialize the context before attempting any task ` +
                `unregister.`,
            );

            return Promise.resolve({
                success: false,
                error: 'Context has not been initialized',
            });
        }

        return this.theTasksService.unregisterTask(taskId);
    };

    get contextId(): string | null {
        return this.theDataSyncService?.contextId ?? null;
    }

    get status(): AiContextStatus {
        return this.theStatus;
    }

    hasItem(itemId: string): boolean {
        return this.theDataSyncService?.hasItemWithId(itemId) ?? false;
    }

    hasRunnableTask(taskId: string): boolean {
        return this.theTasksService?.canRunTask(taskId) ?? false;
    }

    hasTask(taskId: string): boolean {
        return this.theTasksService?.hasTask(taskId) ?? false;
    }
}

export const createAiContext = (): AiContext => {
    return new AiContextImpl();
};
