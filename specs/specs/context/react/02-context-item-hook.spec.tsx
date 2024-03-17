import {AiContext as CoreAiContext} from '@nlux-dev/core/src';
import {createAiContext} from '@nlux-dev/react/src';
import {useAiContext} from '@nlux/react';
import {render} from '@testing-library/react';
import React, {useContext} from 'react';
import {describe, expect, it, vi} from 'vitest';
import {createContextAdapterController} from '../../../utils/contextAdapterBuilder';
import {waitForRenderCycle} from '../../../utils/wait';

describe('AI context item hook', () => {
    it('should send the item to AI context', async () => {
        // Arrange
        const adapter = createContextAdapterController()
            .withContextId('contextId123')
            .create();

        const updateItems = vi.fn();
        adapter.updateItems = updateItems;

        const aiContext = createAiContext(adapter);

        let coreContext: CoreAiContext | undefined = undefined;
        const GetCoreContextFromReactContext = (props: {state: number | string}) => {
            coreContext = useContext(aiContext.ref);
            useAiContext(aiContext, 'Test state description', props.state);
            return null;
        };

        // Act
        const {rerender, unmount} = render(
            <aiContext.Provider>
                <GetCoreContextFromReactContext state={'STATE VALUE'}/>
            </aiContext.Provider>,
        );
        await waitForRenderCycle();
        await coreContext!.flush();

        // First assert + Get item ID
        expect(updateItems).toHaveBeenCalledOnce();
        expect(updateItems).toHaveBeenCalledWith(
            'contextId123',
            expect.anything(),
        );
        const itemsUsedInCall1 = updateItems.mock.calls[0][1];
        const itemIds = Object.keys(itemsUsedInCall1);
        expect(itemIds).toHaveLength(1);
        const itemId1 = itemIds[0];
        expect(itemsUsedInCall1[itemId1].value).toBe('STATE VALUE');
        expect(itemsUsedInCall1[itemId1].description).toBe('Test state description');
    });

    it('should update value when state changes', async () => {
        // Arrange
        const adapter = createContextAdapterController()
            .withContextId('contextId123')
            .create();

        const updateItems = vi.fn();
        adapter.updateItems = updateItems;

        const aiContext = createAiContext(adapter);

        let coreContext: CoreAiContext | undefined = undefined;
        const GetCoreContextFromReactContext = (props: {state: number | string}) => {
            coreContext = useContext(aiContext.ref);
            useAiContext(aiContext, 'Test state description', props.state);
            return null;
        };

        // Act
        const {rerender, unmount} = render(
            <aiContext.Provider>
                <GetCoreContextFromReactContext state={'STATE VALUE 1'}/>
            </aiContext.Provider>,
        );
        await waitForRenderCycle();
        await coreContext!.flush();

        // First assert + Get item ID
        const itemsUsedInCall1 = updateItems.mock.calls[0][1];
        const itemIds = Object.keys(itemsUsedInCall1);
        expect(itemIds).toHaveLength(1);
        const itemId1 = itemIds[0];

        // Act
        rerender(
            <aiContext.Provider>
                <GetCoreContextFromReactContext state={'STATE VALUE 2'}/>
            </aiContext.Provider>,
        );
        await waitForRenderCycle();
        await coreContext!.flush();

        // Second assert
        expect(updateItems).toHaveBeenCalledTimes(2);
        expect(updateItems).toHaveBeenLastCalledWith('contextId123', {
            [itemId1]: {
                value: 'STATE VALUE 2',
                description: undefined,
            },
        });
    });

    it('should update description when state changes', async () => {
        // Arrange
        const adapter = createContextAdapterController()
            .withContextId('contextId123')
            .create();

        const updateItems = vi.fn();
        adapter.updateItems = updateItems;

        const aiContext = createAiContext(adapter);

        let coreContext: CoreAiContext | undefined = undefined;
        const GetCoreContextFromReactContext = (props: {state: number | string, description: string}) => {
            coreContext = useContext(aiContext.ref);
            useAiContext(aiContext, props.description, props.state);
            return null;
        };

        // Act
        const {rerender, unmount} = render(
            <aiContext.Provider>
                <GetCoreContextFromReactContext
                    state={'STATE VALUE 1'}
                    description={'Test state description 1'}
                />
            </aiContext.Provider>,
        );
        await waitForRenderCycle();
        await coreContext!.flush();

        // First assert + Get item ID
        const itemsUsedInCall1 = updateItems.mock.calls[0][1];
        const itemIds = Object.keys(itemsUsedInCall1);
        expect(itemIds).toHaveLength(1);
        const itemId1 = itemIds[0];

        // Act
        rerender(
            <aiContext.Provider>
                <GetCoreContextFromReactContext
                    state={'STATE VALUE 1'}
                    description={'Test state description 2'}
                />
            </aiContext.Provider>,
        );
        await waitForRenderCycle();
        await coreContext!.flush();

        // Second assert
        expect(updateItems).toHaveBeenCalledTimes(2);
        expect(updateItems).toHaveBeenLastCalledWith('contextId123', {
            [itemId1]: {
                value: undefined,
                description: 'Test state description 2',
            },
        });
    });
});
