import {
    ContextActionResult,
    ContextAdapter,
    ContextAdapterExtras,
    ContextItems,
    ContextTasks,
    SetContextResult,
} from '@nlux/core';

type BackendContextAction =
    'update-context-items'
    | 'update-context-tasks'
    | 'remove-context-items'
    | 'remove-context-tasks'
    | 'reset-context-tasks'
    | 'reset-context-items'
    | 'discard-context'
    | 'create-context';

export class NLBridgeContextAdapter implements ContextAdapter {

    private readonly url: string;

    constructor(url: string) {
        this.url = url;
    }

    async create(contextItems?: ContextItems, extras?: ContextAdapterExtras): Promise<SetContextResult> {
        try {
            const result = await fetch(this.url, {
                method: 'POST',
                headers: {
                    ...extras?.headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'create-context',
                    payload: contextItems ? {items: contextItems} : undefined,
                }),
            });

            if (!result.ok) {
                return {
                    success: false,
                    error: 'Failed to set context',
                };
            }

            const data = await result.json();
            if (!data?.result?.contextId) {
                return {
                    success: false,
                    error: 'Invalid context ID',
                };
            }

            return {
                success: true,
                contextId: data.result.contextId,
            };
        } catch (e) {
            return {
                success: false,
                error: 'Failed to set context',
            };
        }
    }

    discard(contextId: string, extras?: ContextAdapterExtras): Promise<ContextActionResult> {
        return this.sendAction(
            contextId,
            'discard-context',
            undefined,
            extras,
        );
    }

    removeItems(contextId: string, itemIds: string[], extras?: ContextAdapterExtras): Promise<ContextActionResult> {
        return this.sendAction(
            contextId,
            'remove-context-items',
            {itemIds},
            extras,
        );
    }

    async removeTasks(contextId: string, taskIds: string[], extras?: ContextAdapterExtras): Promise<ContextActionResult> {
        return this.sendAction(
            contextId,
            'remove-context-tasks',
            {taskIds},
            extras,
        );
    }

    resetItems(contextId: string, newItems?: ContextItems, extras?: ContextAdapterExtras): Promise<ContextActionResult> {
        return this.sendAction(
            contextId,
            'reset-context-items',
            newItems ? {items: newItems} : undefined,
            extras,
        );
    }

    resetTasks(contextId: string, newTasks?: ContextTasks, extras?: ContextAdapterExtras): Promise<ContextActionResult> {
        return this.sendAction(
            contextId,
            'reset-context-tasks',
            newTasks,
            extras,
        );
    }

    async sendAction(contextId: string, action: BackendContextAction, payload?: any, extras?: ContextAdapterExtras): Promise<{
        success: false;
        error: string;
    } | {
        success: true;
        items?: any;
    }> {
        if (!contextId) {
            return {
                success: false,
                error: 'Invalid context ID',
            };
        }

        try {
            const result = await fetch(this.url, {
                method: 'POST',
                headers: {
                    ...extras?.headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action,
                    payload: {
                        ...payload,
                        contextId,
                    },
                }),
            });

            if (!result.ok) {
                return {
                    success: false,
                    error: 'Failed to send action',
                };
            }

            const items = await result.json();

            return {
                success: true,
                items,
            };
        } catch (e) {
            return {
                success: false,
                error: 'Failed to send action',
            };
        }
    }

    async updateItems(contextId: string, itemsToUpdate: Partial<ContextItems>, extras?: ContextAdapterExtras): Promise<ContextActionResult> {
        return this.sendAction(
            contextId,
            'update-context-items',
            {items: itemsToUpdate},
            extras,
        );
    }

    async updateTasks(contextId: string, tasks: Partial<ContextTasks>, extras: ContextAdapterExtras | undefined): Promise<ContextActionResult> {
        throw new Error('Method not implemented.');
    }
}
