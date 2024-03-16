import {ContextAdapter} from '../../types/adapters/context/contextAdapter';
import {ContextDataAdapter} from '../../types/adapters/context/contextDataAdapter';
import {DestroyContextResult, InitializeContextResult} from '../../types/aiContext/contextResults';
import {ContextItemDataType, ContextItems} from '../../types/aiContext/data';
import {warn} from '../../x/warn';

type UpdateQueueItem = {
    operation: 'set';
    data: ContextItemDataType;
    description: string;
} | {
    operation: 'update';
    data?: ContextItemDataType;
    description?: string;
} | {
    operation: 'delete';
};

export class DataSyncService {

    private actionToPerformWhenIdle: 'flush' | 'reset' | 'none' = 'none';
    private dataAdapter: ContextDataAdapter;
    private readonly itemIds = new Set<string>();
    private status: 'idle' | 'updating' | 'destroyed' = 'idle';
    private theContextId: string | null = null;
    private readonly updateQueueByItemId: Map<string, UpdateQueueItem> = new Map();

    constructor(adapter: ContextDataAdapter | ContextAdapter) {
        this.dataAdapter = adapter;
    }

    get contextId(): string | null {
        return this.theContextId;
    }

    async createContext(initialItems?: ContextItems): Promise<InitializeContextResult> {
        if (this.status === 'destroyed') {
            return {
                success: false,
                error: 'The context has been destroyed',
            };
        }

        const contextItems = initialItems ?? null;
        this.itemIds.clear();
        if (contextItems !== null) {
            const itemIds = Object.keys(contextItems);
            itemIds.forEach((itemId) => {
                this.itemIds.add(itemId);
            });
        }

        this.actionToPerformWhenIdle = 'none';

        try {
            // TODO - Handle retry on failure.
            const result = await this.dataAdapter.create(contextItems ?? {});
            if (result.success) {
                this.theContextId = result.contextId;
                return {
                    success: true,
                    contextId: result.contextId,
                };
            } else {
                return {
                    success: false,
                    error: 'Failed to set the context',
                };
            }
        } catch (error) {
            return {
                success: false,
                error: `${error}`,
            };
        }
    }

    async destroy(): Promise<DestroyContextResult> {
        if (this.status === 'destroyed') {
            warn(`Context.DataSyncService.destroy() called on a state that has already been destroyed`);
            return {
                success: true,
            };
        }

        if (this.status === 'updating' && !this.contextId) {
            warn(`Context.DataSyncService.destroy() called with no contextId!`);
        }

        if (this.contextId) {
            this.status = 'updating';
            await this.dataAdapter.discard(this.contextId);
            // TODO - Handle failure to reset context data.
        }

        this.status = 'destroyed';
        this.theContextId = null;
        this.updateQueueByItemId.clear();
        this.actionToPerformWhenIdle = 'none';

        return {
            success: true,
        };
    }

    async flush(): Promise<void> {
        if (!this.contextId) {
            throw new Error('Context not initialized');
        }

        if (this.status === 'updating') {
            this.actionToPerformWhenIdle = 'flush';
            return;
        }

        this.status = 'updating';

        const itemsInQueue = this.updateQueueByItemId.keys();
        const itemsToUpdate: string[] = [];
        const itemsToDelete: string[] = [];
        for (const itemId of itemsInQueue) {
            const item = this.updateQueueByItemId.get(itemId);
            if (!item) {
                continue;
            }

            if (item.operation === 'delete') {
                itemsToDelete.push(itemId);
                continue;
            }

            if (['set', 'update'].includes(item.operation)) {
                itemsToUpdate.push(itemId);
                continue;
            }
        }

        const itemsUpdateObject: Partial<ContextItems> = itemsToUpdate.reduce(
            (acc: Partial<ContextItems>, itemId) => {
                const op = this.updateQueueByItemId.get(itemId);
                if (!op) {
                    return acc;
                }

                if (op.operation === 'set') {
                    acc[itemId] = {
                        value: op.data,
                        description: op.description,
                    };
                }

                if (
                    op.operation === 'update' &&
                    (op.data !== undefined || op.description !== undefined)
                ) {
                    // @ts-ignore
                    // We know that at least one of the two arguments is not undefined.
                    acc[itemId] = {value: op.data, description: op.description};
                }

                return acc;
            },
            {},
        );

        if (Object.keys(itemsUpdateObject).length > 0) {
            Object.keys(itemsUpdateObject).forEach((itemId) => {
                this.updateQueueByItemId.delete(itemId);
            });

            try {
                await this.dataAdapter.updateItems(this.contextId, itemsUpdateObject);
            } catch (error) {
                warn(`Failed to update context data: ${error}`);

                // Reset the items that failed to update.
                Object.keys(itemsUpdateObject).forEach((itemId) => {
                    const item = itemsUpdateObject[itemId];
                    if (!item) {
                        return;
                    }

                    this.updateQueueByItemId.set(itemId, {
                        operation: 'update',
                        data: item.value,
                        description: item.description,
                    });
                });
            }
        }

        if (itemsToDelete.length > 0) {
            itemsToDelete.forEach((itemId) => {
                this.itemIds.delete(itemId);
                this.updateQueueByItemId.delete(itemId);
            });

            try {
                await this.dataAdapter.removeItems(this.contextId, itemsToDelete);
            } catch (error) {
                warn(`Failed to delete context data: ${error}`);

                // Reset the items that failed to delete.
                itemsToDelete.forEach((itemId) => {
                    this.itemIds.add(itemId);
                    this.updateQueueByItemId.set(itemId, {operation: 'delete'});
                });
            }
        }

        await this.backToIdle();
    }

    hasActiveItemWithId(itemId: string): boolean {
        return this.itemIds.has(itemId) && (
            !this.updateQueueByItemId.has(itemId) ||
            this.updateQueueByItemId.get(itemId)?.operation !== 'delete'
        );
    }

    hasItemWithId(itemId: string): boolean {
        return this.itemIds.has(itemId);
    }

    removeItem(itemId: string) {
        if (this.status === 'destroyed') {
            throw new Error('The context has been destroyed');
        }

        if (!this.contextId) {
            throw new Error('Context not initialized');
        }

        if (!this.itemIds.has(itemId)) {
            throw new Error('Item not found');
        }

        this.updateQueueByItemId.set(itemId, {operation: 'delete'});
    }

    async resetContextData(newInitialData?: ContextItems): Promise<void> {
        const victimContextId = this.contextId;

        this.itemIds.clear();
        this.updateQueueByItemId.clear();

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
            await this.dataAdapter.resetItems(victimContextId, newInitialData);
        } catch (error) {
            warn(`Failed to reset context data: ${error}`);
            // TODO - Handle retry on failure.
        }

        this.updateQueueByItemId.clear();
        if (newInitialData) {
            this.itemIds.clear();
            const newItems = Object.keys(newInitialData);
            newItems.forEach((itemId) => {
                this.itemIds.add(itemId);
            });
        } else {
            this.itemIds.clear();
        }

        await this.backToIdle();
    }

    setItemData(itemId: string, description: string, data: ContextItemDataType) {
        if (this.status === 'destroyed') {
            throw new Error('The context has been destroyed');
        }

        this.updateQueueByItemId.set(
            itemId,
            {
                operation: 'set',
                description,
                data,
            },
        );

        this.itemIds.add(itemId);
    }

    updateItemData(itemId: string, description?: string, data?: ContextItemDataType) {
        if (this.status === 'destroyed') {
            throw new Error('The context has been destroyed');
        }

        if (data === undefined && description === undefined) {
            return;
        }

        const currentInQueue: UpdateQueueItem | undefined = this.updateQueueByItemId.get(itemId);
        if (currentInQueue?.operation === 'delete') {
            throw new Error('Item has been deleted');
        }

        const updatedData = data ?? currentInQueue?.data ?? undefined;
        const updatedDescription = description ?? currentInQueue?.description ?? undefined;

        // We know that at least one of the two arguments is not undefined, which is what's required by
        // updateQueueByItemId[itemId] type.

        this.updateQueueByItemId.set(itemId, {
            operation: 'update', data: updatedData, description: updatedDescription,
        });
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
            await this.resetContextData();
            return;
        }
    }
}
