import {createAiContext} from '@nlux-dev/core/src/exports/aiContext/aiContext';
import {describe, expect, it, vi} from 'vitest';
import {createContextAdapterController} from '../../../utils/contextAdapterBuilder';
import {waitForMilliseconds} from '../../../utils/wait';

describe('AiContext register task in edge cases', () => {
    describe('when context is still initializing', () => {
        it('should not call the adapter setTasks method', async () => {
            // Arrange
            const initializationDelay = 1000;
            const aiContext = createAiContext();
            const adapterController = createContextAdapterController();
            const adapter = adapterController.create();
            adapter.updateTasks = vi.fn();
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
            aiContext.registerTask(
                'task-id', 'Task description', vi.fn(), [],
            );
            await aiContext.flush();

            // Assert
            expect(adapter.updateTasks).not.toHaveBeenCalled();
        });
    });

    describe('when a task is registered while the context is flushing', () => {
        it('should be synced after the context finished flushing', async () => {
            // Arrange
            const aiContext = createAiContext();
            const adapterController = createContextAdapterController();
            const adapter = adapterController.withContextId('contextId123').create();
            const updateTasksDelay = 500;
            adapter.updateTasks = vi.fn().mockImplementation(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({success: true});
                    }, updateTasksDelay);
                });
            });
            adapter.create = () => {
                return new Promise((resolve) => {
                    resolve({success: true, contextId: 'contextId123'});
                });
            };

            await aiContext.withAdapter(adapter).initialize();
            aiContext.registerTask(
                'task-nb-1', 'Task description 1', vi.fn(), ['Params of task 1'],
            );

            // Act 1
            // No await here on purpose
            aiContext.flush();
            await waitForMilliseconds(updateTasksDelay / 5);
            expect(adapter.updateTasks).toHaveBeenCalledOnce();
            expect(adapter.updateTasks).toHaveBeenCalledWith(
                'contextId123',
                {
                    'task-nb-1': {
                        description: 'Task description 1',
                        paramDescriptions: ['Params of task 1'],
                    },
                },
            );

            // Act 2
            aiContext.registerTask(
                'task-nb-2', 'Task description 2', vi.fn(), ['Params of task 2'],
            );
            await waitForMilliseconds(updateTasksDelay);
            await aiContext.flush();

            // Assert
            expect(adapter.updateTasks).toHaveBeenCalledTimes(2);
            expect(adapter.updateTasks).toHaveBeenCalledWith(
                'contextId123',
                {
                    'task-nb-2': {
                        description: 'Task description 2',
                        paramDescriptions: ['Params of task 2'],
                    },
                },
            );
        });
    });
});
