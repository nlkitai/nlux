'use client';
import {ComposerStatus} from '@shared/components/Composer/props';
import {createExceptionsBoxController} from '@shared/components/ExceptionsBox/control';
import {className as compExceptionsBoxClassName} from '@shared/components/ExceptionsBox/create';
import {ChatSegment} from '@shared/types/chatSegment/chatSegment';
import {chatItemsToChatSegment} from '@shared/utils/chat/chatItemsToChatSegment';
import {getRootClassNames, getSystemColorScheme} from '@shared/utils/dom/getRootClassNames';
import {warnOnce} from '@shared/utils/warn';
import {forwardRef, ReactElement, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ComposerComp} from '../sections/Composer/ComposerComp';
import {ConversationComp} from '../sections/Conversation/ConversationComp';
import {ImperativeConversationCompProps} from '../sections/Conversation/props';
import {LaunchPad} from '../sections/LaunchPad/LaunchPad';
import {ConversationStarter} from '../types/conversationStarter';
import {adapterParamToUsableAdapter} from '../utils/adapterParamToUsableAdapter';
import {usePreDestroyEventTrigger} from './events/usePreDestroyEventTrigger';
import {useReadyEventTrigger} from './events/useReadyEventTrigger';
import {AiChatInternalApi} from './hooks/useAiChatApi';
import {useAiChatStyle} from './hooks/useAiChatStyle';
import {useAutoScrollController} from './hooks/useAutoScrollController';
import {useCancelLastMessage} from './hooks/useCancelLastMessage';
import {useLastActiveSegmentChangeHandler} from './hooks/useLastActiveSegmentChangeHandler';
import {usePrimitivesContext} from './hooks/usePrimitivesContext';
import {useResubmitPromptHandler} from './hooks/useResubmitPromptHandler';
import {useSubmitPromptHandler} from './hooks/useSubmitPromptHandler';
import {useUiOverrides} from './hooks/useUiOverrides';
import {usMarkdownContainers} from './hooks/usMarkdownContainers';
import {AiChatProps} from './props';

export const AiChat: <AiMsg>(
    props: AiChatProps<AiMsg>,
) => ReactElement = function <AiMsg>(
    props: AiChatProps<AiMsg>,
): ReactElement {
    const {
        adapter, className, initialConversation,
        conversationOptions, composerOptions, displayOptions,
        onCancel
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
    const [newSegments, setChatSegments] = useState<ChatSegment<AiMsg>[]>([]);
    const [cancelledSegmentIds, setCancelledSegmentIds] = useState<Array<string>>([]);
    const [cancelledMessageIds, setCancelledMessageIds] = useState<Array<string>>([]);

    // Derived state and memoized values
    const segments = useMemo(
        () => (initialSegment ? [initialSegment, ...newSegments] : newSegments),
        [initialSegment, newSegments],
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

    const cancelLastMessageRequest = useCancelLastMessage<AiMsg>(
        newSegments, cancelledSegmentIds, cancelledMessageIds,
        setChatSegments, setCancelledSegmentIds, setCancelledMessageIds,
        conversationRef, setComposerStatus,
        onCancel,
    );

    const handlePromptChange = useCallback((value: string) => setPrompt(value), [setPrompt]);
    const handleSubmitPrompt = useSubmitPromptHandler<AiMsg>({
        aiChatProps: props, adapterToUse, conversationRef, initialSegment, newSegments,
        cancelledMessageIds, cancelledSegmentIds, prompt, composerOptions, showException,
        setChatSegments, setComposerStatus, setPrompt,
    });

    const handleResubmitPrompt = useResubmitPromptHandler(
        initialSegment, setInitialSegment, newSegments, setChatSegments, setPrompt, setComposerStatus,
    );

    const handleMarkdownStreamRendered = useCallback((_segmentId: string, messageId: string) => {
        if (props.events?.messageRendered) {
            props.events.messageRendered({uid: messageId});
        }
    }, []);

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
        if (composerStatus === 'submitting-conversation-starter' || composerStatus === 'submitting-external-message'
            || composerStatus === 'submitting-edit') {
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
        internalApiRef.current = internalApi;

        if (typeof internalApi?.__setHost === 'function') {
            internalApi.__setHost({
                sendMessage: (prompt: string) => {
                    setPrompt(prompt);
                    setComposerStatus('submitting-external-message');
                },
                resetConversation: () => {
                    setChatSegments([]);
                    setInitialSegment(undefined);
                },
                cancelLastMessageRequest,
            });
        } else {
            warnOnce(
                'API object passed was is not compatible with AiChat.\n' +
                'Only use API objects created by the useAiChatApi() hook.',
            );
        }
    }, [
        props.api, cancelLastMessageRequest,
        setPrompt, setComposerStatus, setChatSegments, setInitialSegment,
    ]);

    useEffect(() => () => {
        if (typeof internalApiRef.current?.__unsetHost === 'function') {
            internalApiRef.current.__unsetHost();
            internalApiRef.current = undefined;
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
                            userDefinedGreeting={uiOverrides.Greeting}
                        />
                    </div>
                    <div className="nlux-conversation-container" ref={conversationContainerRef} aria-label="Chat conversation" role="log">
                        <ForwardConversationComp
                            ref={conversationRef}
                            segments={segments}
                            conversationOptions={props.conversationOptions}
                            personaOptions={props.personaOptions}
                            messageOptions={props.messageOptions}
                            onLastActiveSegmentChange={handleLastActiveSegmentChange}
                            Loader={uiOverrides.Loader}
                            markdownContainersController={markdownContainersController}
                            submitShortcutKey={props.composerOptions?.submitShortcut}
                            onPromptResubmit={handleResubmitPrompt}
                            onMarkdownStreamRendered={handleMarkdownStreamRendered}
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
                            hideStopButton={props.composerOptions?.hideStopButton}
                            onChange={handlePromptChange}
                            onSubmit={handleSubmitPrompt}
                            onCancel={cancelLastMessageRequest}
                            Loader={uiOverrides.Loader}
                        />
                    </div>
                </div>
            </div>
        </PrimitivesContextProvider>
    );
};
