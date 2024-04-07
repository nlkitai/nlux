import {createAiContext} from '@nlux-dev/core/src/exports/aiContext/aiContext';
import {describe, expect, it, vi} from 'vitest';
import {createContextAdapterController} from '../../../utils/contextAdapterBuilder';
import {waitForMilliseconds} from '../../../utils/wait';

describe('AiContext destroy', () => {
    it('should set the status to destroyed', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapter = {
            set: async () => {
                return {success: true, contextId: 'contextId123'};
            },
            clear: async () => {
                return {success: true};
            },
        } as any;

        // Act
        await aiContext.withAdapter(adapter).initialize();
        await aiContext.destroy();

        // Assert
        expect(aiContext.status).toEqual('destroyed');
    });

    it('should not set the contextId when the adapter finishes initialization after the context is destroyed',
        async () => {
            // Arrange
            const adapter = {
                set: () => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve({success: true, contextId: 'contextId123'});
                        }, 100);
                    });
                },
            } as any;
            const aiContext = createAiContext().withAdapter(adapter);

            // Act: Start the initialization and destroy the context while initialization is in progress
            // then wait for the initialization to complete before checking the contextId, which should be null.
            aiContext.initialize();
            await aiContext.destroy();
            await waitForMilliseconds(200);

            // Assert
            expect(aiContext.contextId).toBeNull();
        },
    );

    it('should not enable observers after the context is destroyed', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapter = {
            set: async () => {
                return {success: true, contextId: 'contextId123'};
            },
            clear: async () => {
                return {success: true};
            },
        } as any;

        // Act
        await aiContext.withAdapter(adapter).initialize();
        await aiContext.destroy();
        const stateItemHandler = aiContext.observeState(
            'state-item',
            'The state of the context has changed',
            123,
        );

        // Assert
        expect(stateItemHandler).toBeUndefined();
    });

    it('should call the adapter clear state item on destroy', async () => {
        // Arrange
        const adapterController = createContextAdapterController();
        const adapter = adapterController.withContextId('contextId123').create();
        adapter.discard = vi.fn();
        const aiContext = createAiContext().withAdapter(adapter);

        // Act
        await aiContext.initialize();
        aiContext.observeState('selected-stock-symbol', 'The selected stock symbol', 'AAPL');
        await aiContext.flush();
        await aiContext.destroy();

        // Assert
        expect(adapter.discard).toHaveBeenCalledWith('contextId123');
    });
});
