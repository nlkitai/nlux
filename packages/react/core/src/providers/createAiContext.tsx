import {AiContextAdapter, ContextAdapterBuilder} from '@nlux/core';
import React, {createContext, useEffect} from 'react';
import {AiContext, AiContextData, AiContextProviderProps} from '../types/AiContext';

export const createAiContext = (adapter: AiContextAdapter | ContextAdapterBuilder): AiContext => {
    const adapterToUse: AiContextAdapter = typeof (adapter as any).create === 'function'
        ? (adapter as ContextAdapterBuilder).create()
        : adapter as AiContextAdapter;

    const context = createContext<AiContextData>({
        contextId: '',
        adapter: adapterToUse,
        data: {},
        registeredTaskCallbacks: {},
    });

    return {
        Provider: (props: AiContextProviderProps) => {
            const [contextId, setContextId] = React.useState<string | undefined>();
            const [contextInitError, setContextInitError] = React.useState<Error | undefined>();

            const {value, children} = props;
            const data = value || {};

            useEffect(() => {
                let proceed = true;

                if (!contextId) {
                    adapterToUse.set(data).then((result) => {
                        if (!proceed) {
                            return;
                        }

                        if (!result.success) {
                            setContextInitError(new Error(result.error));
                            return;
                        }

                        setContextId(result.contextId);
                    }).catch((err) => {
                        if (proceed) {
                            setContextInitError(err);
                        }
                    });
                }

                return () => {
                    proceed = false;
                };
            }, [contextId]);

            const contextData = {
                data,
                adapter: adapterToUse,
                registeredTaskCallbacks: {},
            };

            if (contextInitError) {
                return (
                    <div>
                        <h1>Error initializing AI context</h1>
                        <p>{contextInitError.message}</p>
                    </div>
                );
            }

            if (!contextId) {
                return (
                    <div>
                        <h1>Initializing AI context</h1>
                    </div>
                );
            }

            return (
                <context.Provider value={{
                    ...contextData,
                    contextId,
                }}>
                    {children}
                </context.Provider>
            );
        },
        ref: context,
    };
};
