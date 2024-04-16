import {createAiContext} from '@nlux-dev/core/src/exports/aiContext/aiContext';
import {describe, expect, it, vi} from 'vitest';
import {createContextAdapterController} from '../../../utils/contextAdapterBuilder';

describe('AiContext initialisation', () => {
    it('status should be idle by default', () => {
        // Arrange
        const aiContext = createAiContext();
        // Act
        const status = aiContext.status;
        // Assert
        expect(status).toEqual('idle');
    });

    it('should throw an error if the adapter is not set', async () => {
        // Arrange
        const aiContext = createAiContext();
        // Act
        const warnBefore = console.warn;
        console.warn = vi.fn();
        const result = await aiContext.initialize();

        // Assert
        expect(result).toEqual({success: false, error: expect.stringContaining('Adapter not set')});
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Adapter not set'));

        // Cleanup
        console.warn = warnBefore;
    });

    it('should throw an error if the adapter is set twice', () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.withContextId('contextId123').create();

        // Act
        const action = () => aiContext.withAdapter(adapter).withAdapter(adapter);

        // Assert
        expect(action).toThrow('Adapter already set');
    });

    it('should return an error if the adapter fails to initialize', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.withContextId('contextId123').create();
        adapter.create = () => Promise.resolve({success: false, error: 'Failed to initialize context'});

        // Act
        const result = await aiContext.withAdapter(adapter).initialize();

        // Assert
        expect(result).toEqual({success: false, error: 'Failed to initialize context'});
    });

    it('the contextId should be null if the context is not initialized', () => {
        // Arrange
        const aiContext = createAiContext();

        // Act
        const contextId = aiContext.contextId;

        // Assert
        expect(contextId).toBeNull();
    });

    it('should change the status to error if the adapter fails to initialize', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapter = {
            set: () => Promise.resolve({success: false, error: 'Failed to initialize because of reasons'}),
        } as any;

        // Act
        await aiContext.withAdapter(adapter).initialize();

        // Assert
        expect(aiContext.status).toEqual('error');
    });

    it('should return a contextId if the adapter initializes successfully', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.withContextId('contextId123').create();

        // Act
        const result = await aiContext.withAdapter(adapter).initialize();

        // Assert
        expect(result).toEqual({success: true, contextId: 'contextId123'});
    });

    it('should fail if the user attempts to initialize twice', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.create();

        // Act
        const result1 = await aiContext.withAdapter(adapter).initialize();
        const result2 = await aiContext.initialize();

        // Assert
        expect(result1).toEqual({success: true, contextId: 'contextId123'});
        expect(result2).toEqual({success: false, error: expect.stringContaining('already initialized')});
    });

    it('should set the contextId if the adapter initializes successfully', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.withContextId('contextId123').create();

        // Act
        await aiContext.withAdapter(adapter).initialize();
        // Assert
        expect(aiContext.contextId).toEqual('contextId123');
    });

    it('should change the status to syncing if the adapter initializes successfully', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.create();

        // Act
        await aiContext.withAdapter(adapter).initialize();

        // Assert
        expect(aiContext.status).toEqual('syncing');
    });

    it('context should be initialized with the given data', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.create();

        // Act
        await aiContext.withAdapter(adapter).initialize({
            'state-item1': {
                value: {val: 123},
                description: 'State item number 1',
            },
        });

        // Assert
        expect(adapter.create).toHaveBeenCalledWith({
            'state-item1': {
                value: {val: 123},
                description: 'State item number 1',
            },
        });
    });

    it('should set context to error status if adapter fails to initialize', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.create();
        adapter.create = () => Promise.resolve({success: false, error: 'Failed to initialize context'});

        // Act
        await aiContext.withAdapter(adapter).initialize();

        // Assert
        expect(aiContext.status).toEqual('error');
    });

    it('should not resume after error when second initialize() is called twice', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.create();
        let callCount = 0;
        adapter.create = () => {
            if (callCount === 0) {
                callCount++;
                return Promise.resolve({success: false, error: 'Failed to initialize context'});
            }

            return Promise.resolve({success: true, contextId: 'contextId123'});
        };

        // Act
        await aiContext.withAdapter(adapter).initialize();
        await aiContext.initialize();

        // Assert
        expect(aiContext.status).toEqual('error');
    });
});
