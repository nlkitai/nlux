import {AiContext as CoreAiContext} from '@nlux-dev/core/src/index';
import {createAiContext} from '@nlux-dev/react/src/index';
import {render} from '@testing-library/react';
import React, {useContext} from 'react';
import {describe, expect, it, vi} from 'vitest';
import {createContextAdapterController} from '../../../utils/contextAdapterBuilder';
import {waitForMilliseconds, waitForRenderCycle} from '../../../utils/wait';

describe('React context provider', () => {
    it('should initialize the AI context and get the contextId', async () => {
        // Arrange
        const adapter = createContextAdapterController()
            .withContextId('contextId123')
            .create();

        const aiContext = createAiContext(adapter);
        const component = <aiContext.Provider initialItems={{
            appName: {
                value: 'My App',
                description: 'The name of the application being used',
            },
            appVersion: {
                value: '0.1.0',
                description: 'The version of the application',
            },
        }}>context aware app .. </aiContext.Provider>;

        let coreContext: CoreAiContext | undefined = undefined;
        const GetCoreContextFromReactContext = () => {
            coreContext = useContext(aiContext.ref);
            return null;
        };

        // Act
        render(component);
        render(<GetCoreContextFromReactContext/>);
        await waitForRenderCycle();

        // Assert
        expect(adapter.create).toHaveBeenCalledWith({
            appName: {
                value: 'My App',
                description: 'The name of the application being used',
            },
            appVersion: {
                value: '0.1.0',
                description: 'The version of the application',
            },
        });
    });

    it('should display loading component while initializing the AI context', async () => {
        // Arrange
        const delayBeforeCreateContext = 200;
        const adapter = createContextAdapterController()
            .withContextId('contextId123')
            .create();

        adapter.create = vi.fn(() => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(undefined), delayBeforeCreateContext);
            });
        });
        const aiContext = createAiContext(adapter);
        const component = <aiContext.Provider
            loadingComponent={() => <div>CTX LOADING</div>}>context aware app .. </aiContext.Provider>;

        // Act
        render(component);
        await waitForRenderCycle();

        // Assert
        expect(document.body).toHaveTextContent('CTX LOADING');

        // Act
        await waitForMilliseconds(delayBeforeCreateContext + 1);
        await waitForRenderCycle();
        expect(document.body).not.toHaveTextContent('CTX LOADING');
    });

    it('should display error component when initializing the AI context fails', async () => {
        // Arrange
        const delayBeforeCreateContext = 200;
        const adapter = createContextAdapterController()
            .withContextId('contextId123')
            .create();

        adapter.create = vi.fn(() => {
            return new Promise((resolve, reject) => {
                setTimeout(() => reject(new Error('An error!')), delayBeforeCreateContext);
            });
        });

        const aiContext = createAiContext(adapter);
        const component = <aiContext.Provider
            errorComponent={({error}) => <div>CTX ERROR: {error}</div>}>context aware app .. </aiContext.Provider>;

        // Act
        render(component);
        await waitForRenderCycle();
        await waitForMilliseconds(delayBeforeCreateContext * 1.1);

        // Assert
        expect(document.body).toHaveTextContent('CTX ERROR: Failed to initialize context');
    });
});
