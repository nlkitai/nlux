import {createAiContext} from '@nlux-dev/core/src/core/aiContext/aiContext';
import {describe, expect, it, vi} from 'vitest';
import {createContextAdapterController} from '../../../utils/contextAdapterBuilder';
import {waitForMilliseconds} from '../../../utils/wait';

describe('AiContext observe state in edge cases', () => {
    describe('when context is still initializing', () => {
        it('should not return a valid handler and should warn', async () => {
            // Arrange
            const initializationDelay = 1000;
            const aiContext = createAiContext();
            const adapterController = createContextAdapterController();
            const adapter = adapterController.create();
            adapter.create = () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({success: true, contextId: 'contextId123'});
                    }, initializationDelay);
                });
            };

            // No await here on purpose
            aiContext.withAdapter(adapter).initialize();

            // Act
            const warnBefore = console.warn;
            console.warn = vi.fn();
            const handler = aiContext.observeState(
                'state-item',
                'The state of the context has changed',
                123,
            );

            // Assert
            expect(handler).toBeUndefined();
            expect(console.warn).toHaveBeenCalledWith(
                expect.stringContaining(
                    'AiContextImpl.observeState() called while context is still initializing',
                ),
            );

            // Cleanup
            console.warn = warnBefore;
        });
    });

    describe('when context is destroyed', () => {
        it('should not return a valid handler and should warn', async () => {
            // Arrange
            const aiContext = createAiContext();
            const adapterController = createContextAdapterController();
            const adapter = adapterController.create();
            await aiContext.withAdapter(adapter).initialize();
            await aiContext.destroy();

            // Act
            const warnBefore = console.warn;
            console.warn = vi.fn();
            const handler = aiContext.observeState(
                'state-item',
                'The state of the context has changed',
                123,
            );

            // Assert
            expect(handler).toBeUndefined();
            expect(console.warn).toHaveBeenCalledWith(
                expect.stringContaining('AiContextImpl.observeState() called on destroyed context'),
            );

            // Cleanup
            console.warn = warnBefore;
        });
    });

    describe('when context is idle', () => {
        it('should not return a valid handler and should warn', async () => {
            // Arrange
            const aiContext = createAiContext();
            const adapterController = createContextAdapterController();
            const adapter = adapterController.create();
            aiContext.withAdapter(adapter);

            // Act
            const warnBefore = console.warn;
            console.warn = vi.fn();
            const handler = aiContext.observeState(
                'state-item',
                'The state of the context has changed',
                123,
            );

            // Assert
            expect(handler).toBeUndefined();
            expect(console.warn).toHaveBeenCalledWith(
                expect.stringContaining('AiContextImpl.observeState() called on idle context'),
            );

            // Cleanup
            console.warn = warnBefore;
        });
    });

    describe('when context is syncing', () => {
        it('should return a valid handler', async () => {
            // Arrange
            const aiContext = createAiContext();
            const adapterController = createContextAdapterController();
            const adapter = adapterController.create();
            await aiContext.withAdapter(adapter).initialize();
            const stateItemHandler = aiContext.observeState(
                'state-item',
                'The state of the context has changed',
                123,
            );

            // Assert
            expect(stateItemHandler).toBeDefined();
        });
    });

    describe('when context is syncing and then flushed', () => {
        it('when an item update should happen while syncing, it should be handled', async () => {
            // Arrange
            const delayBeforeFlush = 1000;
            let updateCallsCount = 0;
            const aiContext = createAiContext();
            const adapterController = createContextAdapterController();
            const adapter = adapterController.create();

            adapter.updateItems = vi.fn().mockImplementation(async () => {
                return new Promise((resolve) => {
                    // Delay by 200ms for the first call
                    const updateDelay = updateCallsCount === 0 ? delayBeforeFlush : 0;
                    updateCallsCount++;

                    setTimeout(() => {
                        resolve({success: true});
                    }, updateDelay);
                });
            });

            await aiContext.withAdapter(adapter).initialize();
            const stateItemHandler = aiContext.observeState(
                'state-item',
                'An item in the state',
                123,
            )!;
            // Flush without awaiting
            aiContext.flush();

            // Act
            // An update triggered before the end of the flush
            // but should be performed after the flush
            stateItemHandler.setData(456);
            stateItemHandler.setDescription('The same item in the state with different description');
            await aiContext.flush();
            await waitForMilliseconds(delayBeforeFlush);

            // Assert
            expect(adapter.updateItems).toHaveBeenCalledTimes(2);
            expect(adapter.updateItems).toHaveBeenNthCalledWith(1, 'contextId123', {
                'state-item': {
                    value: 123,
                    description: 'An item in the state',
                },
            });

            expect(adapter.updateItems).toHaveBeenNthCalledWith(2, 'contextId123', {
                'state-item': {
                    value: 456,
                    description: 'The same item in the state with different description',
                },
            });
        });
    });
});
