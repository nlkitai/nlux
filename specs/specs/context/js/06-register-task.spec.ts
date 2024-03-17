import {createAiContext} from '@nlux-dev/core/src/core/aiContext/aiContext';
import {describe, expect, it, vi} from 'vitest';
import {createContextAdapterController} from '../../../utils/contextAdapterBuilder';

describe('AiContext register task', () => {
    it('should return task handler when valid adapter is passed', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.create();

        // Act
        await aiContext.withAdapter(adapter).initialize();
        const taskHandler = aiContext.registerTask(
            'task-id', 'Task description', vi.fn(), ['param1', 'param2'],
        );

        // Assert
        expect(taskHandler).toBeDefined();
    });

    it('should not call the adapter registerTask method as soon as the task is registered', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.create();
        adapter.updateTasks = vi.fn().mockResolvedValue({success: true});
        await aiContext.withAdapter(adapter).initialize();
        const taskId = 'task-id';
        const description = 'Task description';
        const callback = vi.fn();
        const paramDescriptions = ['param1', 'param2'];

        // Act
        aiContext.registerTask(taskId, description, callback, paramDescriptions);

        // Assert
        expect(adapter.updateTasks).not.toHaveBeenCalled();
    });

    it('should call the adapter registerTask method on flush', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.withContextId('context123').create();
        await aiContext.withAdapter(adapter).initialize();
        const taskId = 'task-id';
        const description = 'Task description';
        const callback = vi.fn();
        const paramDescriptions = ['param1', 'param2'];

        // Act
        aiContext.registerTask(taskId, description, callback, paramDescriptions);
        await aiContext.flush();

        // Assert
        expect(adapter.updateTasks).toHaveBeenCalledWith(
            'context123',
            {
                'task-id': {
                    description: 'Task description',
                    paramDescriptions: ['param1', 'param2'],
                },
            },
        );
    });

    it('should log a warning if the adapter setTasks method fails', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.create();
        adapter.updateTasks = vi.fn().mockResolvedValue({success: false, error: 'The Error MSG'});
        await aiContext.withAdapter(adapter).initialize();
        const taskId = 'task-id';
        const description = 'Task description';
        const callback = vi.fn();
        const paramDescriptions = ['param1', 'param2'];
        const initialWarnCallback = console.warn;
        console.warn = vi.fn();

        // Act
        aiContext.registerTask(taskId, description, callback, paramDescriptions);
        await aiContext.flush();

        // Assert
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('The Error MSG'));

        // Cleanup
        console.warn = initialWarnCallback;
    });

    it('should not allow calling callback if the adapter registerTask method fails', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.create();
        adapter.updateTasks = vi.fn().mockResolvedValue(Promise.resolve({
            success: false,
            error: 'The Error MSG',
        }));

        await aiContext.withAdapter(adapter).initialize();
        const taskId = 'task-id';
        const description = 'Task description';
        const callback = vi.fn();
        const paramDescriptions = ['param1', 'param2'];

        // Act
        const taskHandler = aiContext.registerTask(taskId, description, callback, paramDescriptions);
        await aiContext.flush();
        const result = await aiContext.runTask(taskId, []);

        // Assert
        expect(aiContext.hasTask(taskId)).toBe(true);
        expect(aiContext.hasRunnableTask(taskId)).toBe(false);
        expect(callback).not.toHaveBeenCalled();
        expect(result).toEqual({
            success: false,
            error: expect.stringContaining('The task with ID \'task-id\' has no callback'),
        });
    });

    it('should store the task callback if the adapter registerTask method succeeds', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.create();
        adapter.updateTasks = vi.fn().mockResolvedValue(Promise.resolve({success: true}));
        await aiContext.withAdapter(adapter).initialize();
        const taskId = 'task-id';
        const description = 'Task description';
        const callback = vi.fn();
        const paramDescriptions = ['param1', 'param2'];

        // Act
        aiContext.registerTask(taskId, description, callback, paramDescriptions);
        await aiContext.flush();

        // Assert
        expect(aiContext.hasTask(taskId)).toBe(true);
        expect(aiContext.hasRunnableTask(taskId)).toBe(true);
    });

    it('should not register a task twice', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.withContextId('context123').create();
        adapter.updateTasks = vi.fn().mockResolvedValue({success: true});
        await aiContext.withAdapter(adapter).initialize();
        const taskId = 'task-id';
        const description = 'Task description';
        const callback = vi.fn();
        const paramDescriptions = ['param1', 'param2'];
        const originalWarn = console.warn;
        console.warn = vi.fn();

        // Act
        const taskHandler1 = aiContext.registerTask(
            taskId, description, callback, paramDescriptions,
        );

        const taskHandler2 = aiContext.registerTask(
            taskId, description, callback, paramDescriptions,
        );

        await aiContext.flush();

        // Assert
        expect(taskHandler1).toBeDefined();
        expect(taskHandler2).toBeUndefined();
        expect(adapter.updateTasks).toHaveBeenCalledTimes(1);
        expect(adapter.updateTasks).toHaveBeenCalledWith(
            'context123',
            {
                'task-id': {
                    description: 'Task description',
                    paramDescriptions: ['param1', 'param2'],
                },
            },
        );
        expect(console.warn).toHaveBeenCalledWith(
            expect.stringContaining('existing taskId'),
        );

        // Cleanup
        console.warn = originalWarn;
    });

    it('should not call the adapter registerTask method if the task is already registered', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.withContextId('context123').create();
        adapter.updateTasks = vi.fn().mockResolvedValue({success: true});
        await aiContext.withAdapter(adapter).initialize();
        const taskId = 'task-id';
        const description1 = 'Task description 1';
        const description2 = 'Task description 2';
        const callback = vi.fn();
        const paramDescriptions = ['param1', 'param2'];
        aiContext.registerTask(taskId, description1, callback, paramDescriptions);
        await aiContext.flush();

        // Act
        const originalWarn = console.warn;
        console.warn = vi.fn();
        aiContext.registerTask(
            taskId, description2, callback, paramDescriptions,
        );

        await aiContext.flush();

        // Assert
        expect(adapter.updateTasks).toHaveBeenCalledTimes(1);
        expect(adapter.updateTasks).toHaveBeenCalledWith(
            'context123',
            {
                'task-id': {
                    description: 'Task description 1',
                    paramDescriptions: ['param1', 'param2'],
                },
            },
        );
        expect(console.warn).toHaveBeenCalledWith(
            expect.stringContaining('called with existing taskId'),
        );

        // Cleanup
        console.warn = originalWarn;
    });

    it('should not register the task callback if the context is destroyed', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.create();
        adapter.updateTasks = vi.fn().mockResolvedValue({success: true});
        await aiContext.withAdapter(adapter).initialize();
        const taskId = 'task-id';
        const description = 'Task description';
        const callback = vi.fn();
        const paramDescriptions = ['param1', 'param2'];
        await aiContext.destroy();

        // Act
        const originalWarn = console.warn;
        console.warn = vi.fn();
        aiContext.registerTask(taskId, description, callback, paramDescriptions);
        await aiContext.flush();

        // Assert
        expect(aiContext.hasTask(taskId)).toBe(false);
        expect(console.warn).toHaveBeenCalledWith(
            expect.stringContaining('context that has does not have tasks service'),
        );
    });

    it('should remove the task callback when context is destroyed', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.create();
        await aiContext.withAdapter(adapter).initialize();
        const taskId = 'task-id';
        const description = 'Task description';
        const callback = vi.fn();
        const paramDescriptions = ['param1', 'param2'];
        aiContext.registerTask(taskId, description, callback, paramDescriptions);
        await aiContext.flush();
        expect(aiContext.hasTask(taskId)).toBe(true);

        // Act
        await aiContext.destroy();

        // Assert
        expect(aiContext.hasTask(taskId)).toBe(false);
    });

    it('should call the adapter resetTasks method on destroy when a task is registered',
        async () => {
            // Arrange
            const aiContext = createAiContext();
            const adapterController = createContextAdapterController();
            const adapter = adapterController.withContextId('context123').create();
            adapter.resetTasks = vi.fn().mockResolvedValue({success: true});
            await aiContext.withAdapter(adapter).initialize();
            aiContext.registerTask(
                'task-id', 'Task description', vi.fn(), ['param1', 'param2'],
            );

            // Act
            await aiContext.destroy();

            // Assert
            expect(adapter.resetTasks).toHaveBeenCalledWith('context123');
        },
    );

    it('should not call the adapter resetTasks method when context is destroyed if there are no tasks registered',
        async () => {
            // Arrange
            const aiContext = createAiContext();
            const adapterController = createContextAdapterController();
            const adapter = adapterController.withContextId('context123').create();
            adapter.resetTasks = vi.fn().mockResolvedValue({success: true});
            await aiContext.withAdapter(adapter).initialize();

            // Act
            await aiContext.destroy();

            // Assert
            expect(adapter.resetTasks).not.toHaveBeenCalled();
        },
    );

    it('should call adapter.removeTasks when task is removed', async () => {
        // Arrange
        const aiContext = createAiContext();
        const adapterController = createContextAdapterController();
        const adapter = adapterController.withContextId('context123').create();
        adapter.removeTasks = vi.fn().mockResolvedValue({success: true});
        await aiContext.withAdapter(adapter).initialize();
        const taskId = 'task-id';
        const description = 'Task description';
        const callback = vi.fn();
        const paramDescriptions = ['param1', 'param2'];
        const taskHandler = aiContext.registerTask(taskId, description, callback, paramDescriptions);
        await aiContext.flush();

        // Act
        taskHandler?.discard();
        await aiContext.flush();

        // Assert
        expect(adapter.removeTasks).toHaveBeenCalledWith('context123', [taskId]);
    });
});
