'use client';
import {forwardRef, ReactElement, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ChatSegment} from '@shared/types/chatSegment/chatSegment';
import {createExceptionsBoxController} from '@shared/components/ExceptionsBox/control';
import {className as compExceptionsBoxClassName} from '@shared/components/ExceptionsBox/create';
import {ComposerStatus} from '@shared/components/Composer/props';
import {chatItemsToChatSegment} from '@shared/utils/chat/chatItemsToChatSegment';
import {getRootClassNames, getSystemColorScheme} from '@shared/utils/dom/getRootClassNames';
import {warnOnce} from '@shared/utils/warn';
import {ConversationComp} from '../sections/Conversation/ConversationComp';
import {ImperativeConversationCompProps} from '../sections/Conversation/props';
import {ComposerComp} from '../sections/Composer/ComposerComp';
import {adapterParamToUsableAdapter} from '../utils/adapterParamToUsableAdapter';
import {usePreDestroyEventTrigger} from './events/usePreDestroyEventTrigger';
import {useReadyEventTrigger} from './events/useReadyEventTrigger';
import {useAiChatStyle} from './hooks/useAiChatStyle';
import {useAutoScrollController} from './hooks/useAutoScrollController';
import {useLastActiveSegmentChangeHandler} from './hooks/useLastActiveSegmentChangeHandler';
import {useSubmitPromptHandler} from './hooks/useSubmitPromptHandler';
import {AiChatProps} from './props';
import {ConversationStarter} from '../types/conversationStarter';
import {LaunchPad} from '../sections/LaunchPad/LaunchPad';
import {useUiOverrides} from './hooks/useUiOverrides';
import {usMarkdownContainers} from './hooks/usMarkdownContainers';
import {usePrimitivesContext} from './hooks/usePrimitivesContext';
import {AiChatInternalApi} from './hooks/useAiChatApi';

export const AiChat: <AiMsg>(
    props: AiChatProps<AiMsg>,
) => ReactElement = function <AiMsg>(
    props: AiChatProps<AiMsg>,
): ReactElement {
    const {
        adapter, className, initialConversation,
        conversationOptions, composerOptions, displayOptions,
    } = props;

    const {themeId, colorScheme} = displayOptions ?? {};

    // References to DOM elements and React components:
    // These are used for advanced interactions such as scrolling, streaming, and exceptions animation
    const conversationRef = useRef<ImperativeConversationCompProps<AiMsg>>(null);
    const conversationContainerRef = useRef<HTMLDivElement>(null);
    const lastActiveSegmentIdRef = useRef<string | undefined>(undefined);
    const exceptionBoxRef = useRef<HTMLDivElement>(null);

    // Controllers for some of the references above
    const autoScrollController = useAutoScrollController(conversationContainerRef, conversationOptions?.autoScroll);
    const exceptionBoxController = useMemo(() => {
        return exceptionBoxRef.current ? createExceptionsBoxController(exceptionBoxRef.current) : undefined;
    }, [exceptionBoxRef.current]);
    const markdownContainersController = usMarkdownContainers();

    // Context state
    const {PrimitivesContextProvider} = usePrimitivesContext({messageOptions: props.messageOptions});

    // Regular component state
    const [prompt, setPrompt] = useState('');
    const [composerStatus, setComposerStatus] = useState<ComposerStatus>('typing');
    const [initialSegment, setInitialSegment] = useState<ChatSegment<AiMsg>>();
    const [chatSegments, setChatSegments] = useState<ChatSegment<AiMsg>[]>([]);

    // Derived state and memoized values
    const segments = useMemo(
        () => (initialSegment ? [initialSegment, ...chatSegments] : chatSegments),
        [initialSegment, chatSegments],
    );

    const adapterToUse = useMemo(() => adapterParamToUsableAdapter<AiMsg>(adapter), [adapter]);
    const rootStyle = useAiChatStyle(displayOptions);

    const rootClassNames = useMemo(
        () => getRootClassNames({className, themeId}).join(' '),
        [className, themeId],
    );

    const colorSchemeToApply = useMemo(
        () => (colorScheme === 'auto' || !colorScheme) ? getSystemColorScheme() : colorScheme,
        [colorScheme],
    );

    // Callbacks and handlers for user interactions and events
    const showException = useCallback(
        (message: string) => exceptionBoxController?.displayException(message),
        [exceptionBoxController],
    );

    const handlePromptChange = useCallback((value: string) => setPrompt(value), [setPrompt]);
    const handleSubmitPrompt = useSubmitPromptHandler<AiMsg>({
        aiChatProps: props, adapterToUse, conversationRef, initialSegment,
        chatSegments, prompt, composerOptions, showException,
        setChatSegments, setComposerStatus, setPrompt,
    });

    const handleConversationStarterSelected = useCallback(
        (conversationStarter: ConversationStarter) => {
            setPrompt(conversationStarter.prompt);
            setComposerStatus('submitting-conversation-starter');
        },
        [setPrompt, setComposerStatus],
    );

    const handleLastActiveSegmentChange = useLastActiveSegmentChangeHandler(
        autoScrollController, lastActiveSegmentIdRef,
    );

    useEffect(() => {
        // Effect used to wait for the 'submitting-conversation-starter' status to submit the prompt
        if (composerStatus === 'submitting-conversation-starter' || composerStatus === 'submitting-external-message') {
            handleSubmitPrompt();
        }
    }, [composerStatus, handleSubmitPrompt]);

    useEffect(() => setInitialSegment(
        initialConversation ? chatItemsToChatSegment(initialConversation) : undefined,
    ), [initialConversation]);

    useEffect(() => {
        if (initialSegment) {
            conversationContainerRef.current?.scrollTo({behavior: 'smooth', top: 50000});
        }
    }, [initialSegment]);

    const internalApiRef = useRef<AiChatInternalApi | undefined>(undefined);

    useEffect(() => {
        const internalApi = props.api as unknown as AiChatInternalApi | undefined;
        if (internalApi !== internalApiRef.current) {
            internalApiRef.current = internalApi;
            if (typeof internalApi?.__setHost === 'function') {
                internalApi.__setHost({
                    sendMessage: (prompt: string) => {
                        setPrompt(prompt);
                        setComposerStatus('submitting-external-message');
                    },
                });
            }
        }
    }, [props.api, setPrompt, handleSubmitPrompt]);

    useEffect(() => () => {
        if (typeof internalApiRef.current?.__unsetHost === 'function') {
            internalApiRef.current.__unsetHost();
        }
    }, []);

    // Lifecycle event triggers
    useReadyEventTrigger<AiMsg>(props);
    usePreDestroyEventTrigger<AiMsg>(props, segments);
    const ForwardConversationComp = useMemo(
        () => forwardRef(ConversationComp<AiMsg>), [],
    );

    // UI overrides
    const uiOverrides = useUiOverrides(props);

    // Variables that do not require memoization or effect
    const hasValidInput = prompt.length > 0;
    const compChatRoomStatusClassName = segments.length === 0 ? 'nlux-chatRoom-starting' : 'nlux-chatRoom-active';

    // This should never happen when using typescript, but since adapter critical to the rest of the <AiChat />
    // component, do add a check and a warning in case it is not provided.
    if (!adapterToUse) {
        warnOnce('AiChat: No valid adapter provided. The component will not render.');
        return <></>;
    }

    return (
        <PrimitivesContextProvider>
            <div className={rootClassNames} style={rootStyle} data-color-scheme={colorSchemeToApply}>
                <div className={compExceptionsBoxClassName} ref={exceptionBoxRef}/>
                <div className={`nlux-chatRoom-container ${compChatRoomStatusClassName}`}>
                    <div className="nlux-launchPad-container">
                        <LaunchPad
                            segments={segments}
                            onConversationStarterSelected={handleConversationStarterSelected}
                            conversationOptions={conversationOptions}
                            personaOptions={props.personaOptions}
                        />
                    </div>
                    <div className="nlux-conversation-container" ref={conversationContainerRef}>
                        <ForwardConversationComp
                            ref={conversationRef}
                            segments={segments}
                            conversationOptions={props.conversationOptions}
                            personaOptions={props.personaOptions}
                            messageOptions={props.messageOptions}
                            onLastActiveSegmentChange={handleLastActiveSegmentChange}
                            Loader={uiOverrides.Loader}
                            markdownContainersController={markdownContainersController}
                        />
                    </div>
                    <div className="nlux-composer-container">
                        <ComposerComp
                            status={composerStatus}
                            prompt={prompt}
                            hasValidInput={hasValidInput}
                            placeholder={props.composerOptions?.placeholder}
                            autoFocus={props.composerOptions?.autoFocus}
                            submitShortcut={props.composerOptions?.submitShortcut}
                            onChange={handlePromptChange}
                            onSubmit={handleSubmitPrompt}
                            Loader={uiOverrides.Loader}
                        />
                    </div>
                </div>
            </div>
        </PrimitivesContextProvider>
    );
};
