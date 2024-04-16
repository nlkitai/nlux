import {createAiContext} from '@nlux-dev/core/src/exports/aiContext/aiContext';
import {describe, expect, it, vi} from 'vitest';
import {createContextAdapterController} from '../../../utils/contextAdapterBuilder';

describe('AiContext update task', () => {
    it('task handler should have updater methods', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.create();
        await aiContext.withAdapter(adapter).initialize();

        // Act
        const taskHandler = aiContext.registerTask(
            'task-id', 'Task description', vi.fn(), ['param1', 'param2'],
        );

        // Assert
        expect(taskHandler?.setDescription).toBeDefined();
        expect(taskHandler?.setCallback).toBeDefined();
        expect(taskHandler?.setParamDescriptions).toBeDefined();
    });

    it('should not immediately update the task description', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.create();
        await aiContext.withAdapter(adapter).initialize();
        const taskHandler = aiContext.registerTask(
            'task-id', 'Task description', vi.fn(), ['param1', 'param2'],
        );

        // Act
        taskHandler?.setDescription('New description');

        // Assert
        expect(adapter.updateTasks).not.toHaveBeenCalled();
    });

    it('should update the task description on flush', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.withContextId('contextId123').create();
        await aiContext.withAdapter(adapter).initialize();
        const taskHandler = aiContext.registerTask(
            'task-id', 'Task description', vi.fn(), ['param1', 'param2'],
        );

        // Act
        taskHandler?.setDescription('New description');
        await aiContext.flush();

        // Assert
        expect(adapter.updateTasks).toHaveBeenCalledWith(
            'contextId123', {
                'task-id': {
                    description: 'New description',
                },
            },
        );
    });

    it('should immediately update the task callback', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.create();
        await aiContext.withAdapter(adapter).initialize();
        const taskHandler = aiContext.registerTask(
            'task-id', 'Task description', vi.fn(), ['param1', 'param2'],
        );
        await aiContext.flush();

        // Act
        const newCallback = vi.fn();
        taskHandler?.setCallback(newCallback);

        // Assert
        await aiContext.runTask('task-id', ['param1', 'param2']);
        expect(newCallback).toHaveBeenCalled();
    });

    it('should not immediately update the task param descriptions', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.create();
        await aiContext.withAdapter(adapter).initialize();
        const taskHandler = aiContext.registerTask(
            'task-id', 'Task description', vi.fn(), ['param1', 'param2'],
        );
        await aiContext.flush();
        expect(adapter.updateTasks).toHaveBeenCalledWith(
            'contextId123',
            expect.objectContaining({
                'task-id': {
                    description: 'Task description',
                    paramDescriptions: ['param1', 'param2'],
                },
            }),
        );

        // Act
        taskHandler?.setParamDescriptions(['newParam1', 'newParam2']);

        // Assert
        expect(adapter.updateTasks).toHaveBeenCalledOnce();
    });

    it('should update the task param descriptions on flush', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.withContextId('contextId123').create();
        await aiContext.withAdapter(adapter).initialize();
        const taskHandler = aiContext.registerTask(
            'task-id', 'Task description', vi.fn(), ['param1', 'param2'],
        );
        await aiContext.flush();

        // Act
        taskHandler?.setParamDescriptions(['newParam1', 'newParam2']);
        await aiContext.flush();

        // Assert
        expect(adapter.updateTasks).toHaveBeenCalledWith(
            'contextId123', {
                'task-id': {
                    paramDescriptions: ['newParam1', 'newParam2'],
                },
            },
        );
    });
});
