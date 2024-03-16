import {createAiContext} from '@nlux-dev/core/src/core/aiContext/aiContext';
import {describe, expect, it, vi} from 'vitest';
import {createContextAdapterController} from '../../../utils/contextAdapterBuilder';

describe('AiContext reset', () => {
    it('should reset the context', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.create();

        // Act
        await aiContext.withAdapter(adapter).initialize();
        const result = await aiContext.reset();

        // Assert
        expect(result).toEqual({success: true});
    });

    it('should fail and warn when context is not initialized', async () => {
        // Arrange
        const aiContext = createAiContext();

        // Act
        const warnBefore = console.warn;
        console.warn = vi.fn();
        const result = await aiContext.reset();

        // Assert
        expect(result).toEqual({
            success: false,
            error: expect.stringContaining('Context has not been initialized'),
        });

        expect(console.warn).toHaveBeenCalledWith(
            expect.stringContaining('reset() called on a state that has not been initialized'),
        );

        // Cleanup
        console.warn = warnBefore;
    });

    it('should not reset contextId', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.create();
        adapter.create = () => {
            return new Promise((resolve) => {
                // Random contextId
                const contextId = `contextId${Math.ceil(Math.random() * 1000)}`;
                resolve({success: true, contextId});
            });
        };

        // Act
        const initResult = await aiContext.withAdapter(adapter).initialize();
        const contextIdBefore = aiContext.contextId;
        const resetResult = await aiContext.reset();
        const contextIdAfter = aiContext.contextId;

        // Assert
        expect(initResult).toEqual({success: true, contextId: contextIdBefore});
        expect(resetResult).toEqual({success: true});
        expect(contextIdBefore).not.toBeNull();
        expect(contextIdBefore).toEqual(contextIdAfter);
    });

    it('should call adapter reset with contextId', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.create();
        adapter.resetItems = vi.fn();

        // Act
        await aiContext.withAdapter(adapter).initialize({
            item1: {
                value: 'data1',
                description: 'description1',
            },
        });

        await aiContext.reset();

        // Assert
        expect(adapter.resetItems).toHaveBeenCalledWith(aiContext.contextId, undefined);
    });

    it('should call adapter reset with contextId and data', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.create();
        adapter.resetItems = vi.fn();

        // Act
        await aiContext.withAdapter(adapter).initialize({
            item1: {
                value: 'data1',
                description: 'description1',
            },
        });

        await aiContext.reset({
            item2: {
                value: 'data2',
                description: 'description2',
            },
        });

        // Assert
        expect(adapter.resetItems).toHaveBeenCalledWith(
            aiContext.contextId,
            {
                item2: {
                    value: 'data2',
                    description: 'description2',
                },
            },
        );
    });
});
