import {
    AiContext as CoreAiContext,
    ContextAdapter,
    ContextAdapterBuilder,
    createAiContext as createCoreAiContext,
    InitializeContextResult,
    predefinedContextSize,
} from '@nlux/core';
import React, {createContext, useEffect} from 'react';
import {AiContext, AiContextProviderProps} from '../types/AiContext';

/**
 * Creates a new AI context with a React context provider that can be used to sync application state
 * with the backend for AI processing.
 *
 * The input is a context adapter that handles the communication with the backend. nlux provides several
 * context adapters out of the box, but developers can also create their own adapters by implementing the
 * ContextAdapter interface.
 *
 * Usage:
 *
 * At the root level of the application, create the AI context and wrap the app with the context provider:
 * ```tsx
 * const MyAiContext = createAiContext(contextAdapter);
 *
 * const App = () => (
 *   <MyAiContext.Provider>
 *     <MyApp/>
 *   </MyAiContext.Provider>
 * );
 * ```
 *
 * Then, in any component that needs to access the AI context, use the context reference:
 *
 * ```tsx
 * useAiContext(MyAiContext, 'Description of the data', dataToSync);
 * useAiTask(MyAiContext, 'Description of the task', callbackFunction, ['Description of the parameters']);
 * ```
 *
 * @param {ContextAdapter | ContextAdapterBuilder} adapter
 * @returns {AiContext}
 */
export const createAiContext = (adapter: ContextAdapter | ContextAdapterBuilder): AiContext => {

    // The const name below starts with 'unused' because its only purpose is to create the adapter,
    // As soon as the React context is rendered (via the context.Provider component return below),
    // a new coreAiContext instance is created used with that adapter.
    const unusedAiContext = createCoreAiContext();
    const ReactContext = createContext<CoreAiContext>(unusedAiContext);

    return {
        // React component that provides the AI context to the children
        // To be used as <aiContextInstance.Provider> context aware app .. </aiContextInstance.Provider>
        Provider: (props: AiContextProviderProps) => {
            //
            // Provider
            //
            const [
                contextId,
                setContextId,
            ] = React.useState<string | undefined>();

            const [
                contextInitError,
                setContextInitError,
            ] = React.useState<Error | undefined>();

            const [
                coreAiContext,
                setCoreAiContext,
            ] = React.useState<CoreAiContext>();

            //
            // Initialize the AI context and get the contextId
            //
            useEffect(() => {
                let usableContext = true;
                const newContext = createCoreAiContext()
                    .withAdapter(adapter)
                    .withDataSyncOptions({
                        syncStrategy: 'auto',
                        contextSize: predefinedContextSize['100k'],
                    });

                setCoreAiContext(newContext);

                newContext
                    .initialize(props.initialItems || {})
                    .then((result: InitializeContextResult) => {
                        if (!usableContext) {
                            return;
                        }

                        if (result.success) {
                            setContextId(result.contextId);
                        } else {
                            setContextInitError(new Error(result.error));
                        }
                    });

                return () => {
                    usableContext = false;
                    newContext.destroy();
                };
            }, []);

            const {children} = props;

            if (contextInitError) {
                if (props.errorComponent) {
                    return <props.errorComponent error={contextInitError.message}/>;
                }

                return (
                    <div>
                        <h1>Error initializing AI context</h1>
                        <p>{contextInitError.message}</p>
                    </div>
                );
            }

            if (!contextId || !coreAiContext) {
                if (props.loadingComponent) {
                    return <props.loadingComponent/>;
                }

                return null;
            }

            return (
                <ReactContext.Provider value={coreAiContext}>
                    {children}
                </ReactContext.Provider>
            );
        },
        ref: ReactContext,
    };
};
