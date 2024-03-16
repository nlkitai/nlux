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

export const createAiContext = (adapter: ContextAdapter | ContextAdapterBuilder): AiContext => {

    // Unused because it's only used to initialize the React context
    // but as soon as the React context is used (in the Provider component)
    // another value is used.
    const unusedAiContext = createCoreAiContext().withAdapter(adapter);
    const reactContext = createContext<CoreAiContext>(unusedAiContext);

    return {
        // React component that provides the AI context to the children
        // To be used as <aiContextInstance.Provider> context aware app .. </aiContextInstance.Provider>
        Provider: (props: AiContextProviderProps) => {
            //
            // Provider
            //
            const [contextId, setContextId] = React.useState<string | undefined>();
            const [contextInitError, setContextInitError] = React.useState<Error | undefined>();
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
                    .initialize(props.initialContext || {})
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
                return (
                    <div>
                        <h1>Error initializing AI context</h1>
                        <p>{contextInitError.message}</p>
                    </div>
                );
            }

            if (!contextId || !coreAiContext) {
                return (
                    <div>
                        <h1>Initializing AI context</h1>
                    </div>
                );
            }

            return (
                <reactContext.Provider value={coreAiContext}>
                    {children}
                </reactContext.Provider>
            );
        },
        ref: reactContext,
    };
};
