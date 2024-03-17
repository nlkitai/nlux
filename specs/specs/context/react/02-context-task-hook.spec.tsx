import {AiContext as CoreAiContext} from '@nlux-dev/core/src';
import {createAiContext} from '@nlux-dev/react/src';
import {useAiTask} from '@nlux-dev/react/src/providers/useAiTask';
import {render} from '@testing-library/react';
import React, {useContext} from 'react';
import {describe, expect, it, vi} from 'vitest';
import {createContextAdapterController} from '../../../utils/contextAdapterBuilder';
import {waitForRenderCycle} from '../../../utils/wait';

describe('AI context task hook', () => {
    it('should send the task information to AI context', async () => {
        // Arrange
        const adapter = createContextAdapterController()
            .withContextId('contextId123')
            .create();

        const updateTasks = vi.fn();
        adapter.updateTasks = updateTasks;

        const aiContext = createAiContext(adapter);
        const aiTask = vi.fn();
        let coreContext: CoreAiContext | undefined = undefined;

        const ComponentWithAiTask = (props: {
            description: string,
            callback: Function,
            paramDescriptions: string[],
        }) => {
            coreContext = useContext(aiContext.ref);
            useAiTask(aiContext, props.description, props.callback, props.paramDescriptions);
            return null;
        };

        // Act
        render(
            <aiContext.Provider>
                <ComponentWithAiTask
                    description={'Test task description'}
                    callback={aiTask}
                    paramDescriptions={['param1', 'param2']}
                />
            </aiContext.Provider>,
        );
        await waitForRenderCycle();
        await coreContext!.flush();

        // Assert
        expect(updateTasks).toHaveBeenCalledOnce();
        expect(updateTasks).toHaveBeenCalledWith(
            'contextId123',
            expect.anything(),
        );
        const itemsUsedInCall1 = updateTasks.mock.calls[0][1];
        const itemIds = Object.keys(itemsUsedInCall1);
        expect(itemIds).toHaveLength(1);
        const itemId1 = itemIds[0];
        expect(itemsUsedInCall1[itemId1].description).toBe('Test task description');
        expect(itemsUsedInCall1[itemId1].paramDescriptions).toEqual(['param1', 'param2']);
    });

    it('should remove the task when the component unmounts', async () => {
        // Arrange
        const adapter = createContextAdapterController()
            .withContextId('contextId123')
            .create();

        adapter.updateTasks = vi.fn();

        const aiContext = createAiContext(adapter);
        const aiTask = vi.fn();
        let coreContext: CoreAiContext | undefined = undefined;

        const ComponentWithAiTask = (props: {
            description: string,
            callback: Function,
            paramDescriptions: string[],
        }) => {
            useAiTask(aiContext, props.description, props.callback, props.paramDescriptions);
            if (!coreContext) {
                coreContext = useContext(aiContext.ref);
            }
            return null;
        };

        // Act
        const {rerender} = render(
            <aiContext.Provider>
                <ComponentWithAiTask
                    description={'Test task description'}
                    callback={aiTask}
                    paramDescriptions={['param1', 'param2']}
                />
            </aiContext.Provider>,
        );
        await waitForRenderCycle();
        await coreContext!.flush();

        // Get task ID
        expect(adapter.updateTasks).toHaveBeenCalledOnce();
        const itemsUsedInCall1 = adapter.updateTasks.mock.calls[0][1];
        const itemIds = Object.keys(itemsUsedInCall1);
        expect(itemIds).toHaveLength(1);
        const itemId1 = itemIds[0];

        rerender(
            <aiContext.Provider>
                No more components with AI context!
            </aiContext.Provider>,
        );
        await waitForRenderCycle();
        await coreContext!.flush();

        // Assert
        expect(adapter.updateTasks).toHaveBeenCalledOnce();
        expect(adapter.removeTasks).toHaveBeenCalledOnce();
    });
});
