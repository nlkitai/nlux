import {createContext, ReactElement, useEffect, useMemo, useState} from 'react';
import {PrimitivesContextData} from '../../types/PrimitivesContext';

export const primitivesContext = createContext<
    PrimitivesContextData<any>
>({});

export const usePrimitivesContext = function <AiMsg>(
    contextData: PrimitivesContextData<AiMsg>,
) {
    const [
        contextState,
        setContextState,
    ] = useState<PrimitivesContextData<AiMsg>>(contextData);

    useEffect(() => {
        setContextState(contextData);
    }, [
        // Right now, the only primitive relying on contextData is <Markdown />
        contextData?.messageOptions?.htmlSanitizer,
        contextData?.messageOptions?.syntaxHighlighter,
        contextData?.messageOptions?.markdownLinkTarget,
        contextData?.messageOptions?.showCodeBlockCopyButton,
        contextData?.messageOptions?.skipStreamingAnimation,
        contextData?.messageOptions?.streamingAnimationSpeed,
        contextData?.messageOptions?.waitTimeBeforeStreamCompletion,
        contextData?.messageOptions?.responseRenderer,
        contextData?.messageOptions?.promptRenderer,
    ]);

    const PrimitivesContextProvider = useMemo(() =>
            ({children}: {children: ReactElement}) => {
                return (
                    <primitivesContext.Provider value={contextState}>
                        {children}
                    </primitivesContext.Provider>
                );
            },
        [contextState],
    );

    return {
        PrimitivesContextProvider,
        primitivesContext,
    };
};
