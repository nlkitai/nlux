import {createAiContext} from '@nlux-dev/core/src/exports/aiContext/aiContext';
import {describe, expect, it} from 'vitest';
import {createContextAdapterController} from '../../../utils/contextAdapterBuilder';
import {waitForMilliseconds} from '../../../utils/wait';

describe('AiContext observe state', () => {
    it('should return context item handler', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapter = createContextAdapterController().create();

        // Act
        await aiContext.withAdapter(adapter).initialize();
        const stateItemHandler = aiContext.observeState(
            'state-item',
            'The state of the context has changed',
            123,
        );

        // Assert
        expect(stateItemHandler).toBeDefined();
    });

    it('adapter.update() should not immediately be called when context.observeState() is called', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const contextAdapter = adapterController.withContextId('contextId123').create();
        await aiContext.withAdapter(contextAdapter).initialize({
            'state-item1': {
                value: {val: 123},
                description: 'State item number 1',
            },
        });
        await aiContext.flush();

        // Act
        aiContext.observeState(
            'state-item2',
            'The state of the context has changed',
            {val: 456},
        );

        // Assert
        expect(contextAdapter.updateItems).not.toHaveBeenCalledWith('contextId123', expect.objectContaining({
            'state-item2': {val: 456},
        }));
    });

    describe('on aiContext.observeState()', () => {
        describe('on flush', () => {
            it('context adapter should be called with the initial item data and description', async () => {
                // Arrange
                const aiContext = createAiContext();
                const adapterController = createContextAdapterController();
                const contextAdapter = adapterController.withContextId('contextId123').create();
                await aiContext.withAdapter(contextAdapter).initialize({
                    'state-item1': {
                        value: {val: 123},
                        description: 'State item number 1',
                    },
                });
                await aiContext.flush();

                // Act
                aiContext.observeState('state-item2', 'State item number 2', {val: 456});
                await aiContext.flush();

                // Assert
                expect(contextAdapter.updateItems).toHaveBeenCalledWith('contextId123', expect.objectContaining({
                    'state-item2': {
                        value: {val: 456},
                        description: 'State item number 2',
                    },
                }));
            });
        });
    });

    describe('on handler.setData()', () => {
        describe('on flush', () => {
            it('when handler.setData(data) is called after set, only one call to adapter.update() with merged data is made',
                async () => {
                    // Arrange
                    const aiContext = createAiContext();
                    const adapterController = createContextAdapterController();
                    const contextAdapter = adapterController.withContextId('contextId123').create();
                    await aiContext.withAdapter(contextAdapter).initialize({
                        'state-item1': {
                            value: {val: 123},
                            description: 'State item number 1',
                        },
                    });
                    await aiContext.flush();

                    // Act
                    const stateItemHandler = aiContext.observeState(
                        'state-item2',
                        'State item number 2',
                        {val: 456},
                    )!;

                    stateItemHandler.setData({val: 789});
                    stateItemHandler.setData({val: 101112});

                    await waitForMilliseconds(100);
                    await aiContext.flush();

                    // Assert
                    expect(contextAdapter.updateItems).not.toHaveBeenCalledWith(
                        'contextId123',
                        expect.objectContaining({
                            'state-item2': {
                                value: {val: 123},
                                description: 'State item number 2',
                            },
                        }),
                    );

                    expect(contextAdapter.updateItems).not.toHaveBeenCalledWith(
                        'contextId123',
                        expect.objectContaining({
                            'state-item2': expect.objectContaining({
                                value: {val: 456},
                            }),
                        }),
                    );

                    expect(contextAdapter.updateItems).toHaveBeenCalledWith(
                        'contextId123',
                        expect.objectContaining({
                            'state-item2': {
                                description: 'State item number 2',
                                value: {val: 101112},
                            },
                        }),
                    );
                },
            );
        });
    });

    describe('on handler.setDescription()', () => {
        describe('on flush', () => {
            it('when handler.setDescription(str) is called after set, only one call to adapter.update() with merged data is made',
                async () => {
                    // Arrange
                    const aiContext = createAiContext();
                    const adapterController = createContextAdapterController();
                    const contextAdapter = adapterController.withContextId('contextId123').create();
                    await aiContext.withAdapter(contextAdapter).initialize({
                        'state-item1': {
                            value: {val: 123},
                            description: 'State item number 1',
                        },
                    });
                    await aiContext.flush();

                    // Act
                    const stateItemHandler = aiContext.observeState(
                        'state-item2',
                        'State item number 2',
                        {val: 456},
                    )!;

                    stateItemHandler.setData({val: 789});
                    stateItemHandler.setDescription('State item number 2 - updated');

                    await waitForMilliseconds(100);
                    await aiContext.flush();

                    // Assert
                    expect(contextAdapter.updateItems).not.toHaveBeenCalledWith(
                        'contextId123',
                        expect.objectContaining({
                            'state-item2': {
                                value: {val: 789},
                                description: 'State item number 2',
                            },
                        }),
                    );

                    expect(contextAdapter.updateItems).not.toHaveBeenCalledWith(
                        'contextId123',
                        expect.objectContaining({
                            'state-item2': expect.objectContaining({
                                value: {val: 456},
                            }),
                        }),
                    );

                    expect(contextAdapter.updateItems).toHaveBeenCalledWith(
                        'contextId123',
                        expect.objectContaining({
                            'state-item2': {
                                value: {val: 789},
                                description: 'State item number 2 - updated',
                            },
                        }),
                    );
                },
            );
        });
    });

    describe('on handler.discard()', () => {
        describe('on flush', () => {
            it('when handler.discard() is called after set, only one call to adapter.removeItems() is made',
                async () => {
                    // Arrange
                    const aiContext = createAiContext();
                    const adapterController = createContextAdapterController();
                    const contextAdapter = adapterController.withContextId('contextId123').create();
                    await aiContext.withAdapter(contextAdapter).initialize({
                        'state-item1': {
                            value: {val: 123},
                            description: 'State item number 1',
                        },
                    });
                    await aiContext.flush();

                    // Act
                    const stateItemHandler = aiContext.observeState(
                        'state-item2',
                        'State item number 2',
                        {val: 456},
                    )!;

                    stateItemHandler.discard();

                    await waitForMilliseconds(100);
                    await aiContext.flush();

                    // Assert
                    expect(contextAdapter.removeItems).toHaveBeenCalledWith('contextId123', ['state-item2']);
                },
            );
        });
    });
});
