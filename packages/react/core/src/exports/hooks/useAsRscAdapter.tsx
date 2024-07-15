import {FunctionComponent, isValidElement, lazy, ReactNode, Suspense, useEffect, useState} from 'react';
import {warn} from '@shared/utils/warn';
import {ChatAdapter} from '../../types/chatAdapter';
import {
    StreamedServerComponent,
    StreamedServerComponentProps,
} from '@shared/types/adapters/chat/serverComponentChatAdapter';

export type RscAdapterState = 'idle' | 'loading' | 'success' | 'error';

/**
 * This hook is used to create a ChatAdapter that uses a React Server Component (RSC) as the assistant message.
 * The RSC is loaded asynchronously. The user prompt and the adapter extras are passed to the RSC as props.
 *
 * @param {Promise<StreamedServerComponent>} moduleLoadingPromise
 * @param {React.ReactNode} loader
 * @returns {ChatAdapter}
 */
export const useAsRscAdapter = function (
    moduleLoadingPromise: Promise<StreamedServerComponent>,
    loader?: ReactNode,
): ChatAdapter {
    return {
        streamServerComponent: (
            message,
            extras,
            events,
        ) => {
            return () => {
                const [state, setState] = useState<
                    RscAdapterState
                >('idle');

                const [
                    AssistantMessage,
                    setAssistantMessage,
                ] = useState<FunctionComponent | null>(null);

                // Start loading the RSC as soon as the component is mounted
                useEffect(() => {
                    setState('loading');
                    moduleLoadingPromise.then((module) => {
                        if (typeof module.default !== 'function') {
                            const errorMessage = 'The module passed to useAsRscAdapter() ' +
                                'as server component does not have a valid default export.';

                            warn(errorMessage);
                            setState('error');
                            events.onError(new Error(errorMessage));
                            return;
                        }

                        setState('success');
                        setAssistantMessage(() => {
                            return lazy(async () => {
                                let resultFromServer: unknown = undefined;
                                let rscExecutionOutput: unknown = undefined;
                                try {
                                    //
                                    // ⭐️ This is where the RSC is executed
                                    //
                                    rscExecutionOutput = module.default(
                                        { message, extras } satisfies StreamedServerComponentProps
                                    );
                                    resultFromServer = await Promise.resolve(rscExecutionOutput);
                                } catch (_error) {
                                    warn(
                                        'An error occurred while rendering the React Server Component (RSC).\n' +
                                        'Please ensure that no server error has occurred.'
                                    );

                                    events.onError(new Error('Error while rendering RSC.'));
                                }

                                events.onServerComponentReceived();

                                if (resultFromServer === undefined || !isValidElement(resultFromServer)) {
                                    events.onError(
                                        new Error(
                                            'Unable to render RSC. The RSC adapter should return a valid React element.'
                                        ),
                                    );
                                    return {default: () => <></>};
                                } else {
                                    return {default: () => <>{resultFromServer}</>};
                                }
                            });
                        });
                    }).catch((e) => {
                        warn(
                            'The module passed to useAsRscAdapter() is not a valid ES module, or did not properly ' +
                            'load! The first parameter passed to useAsRscAdapter() should be the result of a ' +
                            'dynamic import() call [ without await or .then() ]. The module should also have a ' +
                            'default export. Your bundler should be able to handle dynamic imports and ES modules.' +
                            '\n\nReference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports',
                        );
                        setState('error');
                        events.onError(e);
                    });
                }, []);

                if (state === 'idle') {
                    return null;
                }

                if (state === 'loading') {
                    return null;
                }

                if (state === 'error') {
                    warn('Error loading RSC');
                    return <>Error loading RSC</>;
                }

                return (
                    <Suspense fallback={loader ? loader : null}>
                        {AssistantMessage && <AssistantMessage/>}
                    </Suspense>
                );
            };
        },
    };
};
