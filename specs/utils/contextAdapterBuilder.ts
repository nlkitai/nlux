import {ContextAdapter} from '@nlux-dev/core/src/types/adapters/context/contextAdapter';
import {vi} from 'vitest';

export interface ContextAdapterControllerBuilder {
    create(): ContextAdapter;
    withContextId(contextId: string): ContextAdapterControllerBuilder;
}

class ContextAdapterControllerBuilderImpl implements ContextAdapterControllerBuilder {

    private theContextId: string | null = 'contextId123';

    create() {
        const adapter: ContextAdapter = {
            create: vi.fn().mockResolvedValue({success: true, contextId: this.theContextId}),
            discard: vi.fn().mockResolvedValue({success: true}),
            updateItems: vi.fn().mockResolvedValue({success: true}),
            removeItems: vi.fn().mockResolvedValue({success: true}),
            resetItems: vi.fn().mockResolvedValue({success: true}),
            updateTasks: vi.fn().mockResolvedValue({success: true}),
            removeTasks: vi.fn().mockResolvedValue({success: true}),
            resetTasks: vi.fn().mockResolvedValue({success: true}),
        };

        return adapter;
    }

    withContextId(contextId: string | null): ContextAdapterControllerBuilder {
        this.theContextId = contextId;
        return this;
    }
}

export const createContextAdapterController = (): ContextAdapterControllerBuilder => {
    return new ContextAdapterControllerBuilderImpl();
};
