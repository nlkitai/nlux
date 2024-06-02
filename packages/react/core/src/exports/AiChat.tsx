import {forwardRef, ReactElement, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ChatSegment} from '@shared/types/chatSegment/chatSegment';
import {createExceptionsBoxController} from '@shared/components/ExceptionsBox/control';
import {className as compExceptionsBoxClassName} from '@shared/components/ExceptionsBox/create';
import {ComposerStatus} from '@shared/components/Composer/props';
import {chatItemsToChatSegment} from '@shared/utils/chat/chatItemsToChatSegment';
import {getRootClassNames} from '@shared/utils/dom/getRootClassNames';
import {warnOnce} from '@shared/utils/warn';
import {ConversationComp} from '../sections/Conversation/ConversationComp';
import {ImperativeConversationCompProps} from '../sections/Conversation/props';
import {ComposerComp} from '../components/Composer/ComposerComp';
import {adapterParamToUsableAdapter} from '../utils/adapterParamToUsableAdapter';
import {usePreDestroyEventTrigger} from './events/usePreDestroyEventTrigger';
import {useReadyEventTrigger} from './events/useReadyEventTrigger';
import {useAiChatStyle} from './hooks/useAiChatStyle';
import {useAutoScrollController} from './hooks/useAutoScrollController';
import {useLastActiveSegmentChangeHandler} from './hooks/useLastActiveSegmentChangeHandler';
import {useSubmitPromptHandler} from './hooks/useSubmitPromptHandler';
import {AiChatProps} from './props';

export const AiChat: <AiMsg>(
    props: AiChatProps<AiMsg>,
) => ReactElement = function <AiMsg>(
    props: AiChatProps<AiMsg>,
): ReactElement {
    const {
        adapter,
        className,
        initialConversation,
        conversationOptions,
        composerOptions,
        displayOptions,
    } = props;

    const {themeId, colorScheme} = displayOptions ?? {};

    // References to DOM elements and React components:
    // These are use for advanced interactions such as scrolling, streaming, and
    // exceptions animation that cannot be done with the usual React state and props.
    const conversationRef = useRef<ImperativeConversationCompProps<AiMsg>>(null);
    const conversationContainerRef = useRef<HTMLDivElement>(null);
    const lastActiveSegmentIdRef = useRef<string | undefined>(undefined);
    const exceptionBoxRef = useRef<HTMLDivElement>(null);

    // Controllers for some of the references above
    const autoScrollController = useAutoScrollController(conversationContainerRef, conversationOptions?.autoScroll);
    const exceptionBoxController = useMemo(() => {
        return exceptionBoxRef.current ? createExceptionsBoxController(exceptionBoxRef.current) : undefined;
    }, [exceptionBoxRef.current]);

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

    const hasValidInput = useMemo(() => prompt.length > 0, [prompt]);
    const adapterToUse = useMemo(() => adapterParamToUsableAdapter<AiMsg>(adapter), [adapter]);
    const rootStyle = useAiChatStyle(displayOptions);
    const rootClassNames = useMemo(
        () => getRootClassNames({className, themeId, colorScheme}).join(' '),
        [className, themeId, colorScheme],
    );

    // Callbacks and handlers for user interactions and events
    const showException = useCallback(
        (message: string) => exceptionBoxController?.displayException(message),
        [exceptionBoxController],
    );

    const handlePromptChange = useCallback((value: string) => setPrompt(value), [setPrompt]);
    const handleSubmitPrompt = useSubmitPromptHandler<AiMsg>({
        aiChatProps: props,
        adapterToUse,
        conversationRef,
        initialSegment, chatSegments,
        prompt, composerOptions, showException,
        setChatSegments, setComposerStatus, setPrompt,
    });

    const handleLastActiveSegmentChange = useLastActiveSegmentChangeHandler(
        autoScrollController, lastActiveSegmentIdRef,
    );

    useEffect(() => setInitialSegment(
        initialConversation ? chatItemsToChatSegment(initialConversation) : undefined,
    ), [initialConversation]);

    useEffect(() => {
        if (initialSegment) {
            conversationContainerRef.current?.scrollTo({behavior: 'smooth', top: 50000});
        }
    }, [initialSegment]);

    // Lifecycle event triggers
    useReadyEventTrigger<AiMsg>(props);
    usePreDestroyEventTrigger<AiMsg>(props, segments);

    const ForwardConversationComp = useMemo(
        () => forwardRef(ConversationComp<AiMsg>), []);

    if (!adapterToUse) {
        warnOnce('AiChat: No valid adapter provided. The component will not render.');
        return <></>;
    }

    return (
        <div className={rootClassNames} style={rootStyle}>
            <div className={compExceptionsBoxClassName} ref={exceptionBoxRef}/>
            <div className="nlux-chtRm-cntr">
                <div className="nlux-chtRm-cnv-cntr" ref={conversationContainerRef}>
                    <ForwardConversationComp
                        ref={conversationRef}
                        segments={segments}
                        conversationOptions={props.conversationOptions}
                        personaOptions={props.personaOptions}
                        messageOptions={props.messageOptions}
                        onLastActiveSegmentChange={handleLastActiveSegmentChange}
                    />
                </div>
                <div className="nlux-chtRm-prmptBox-cntr">
                    <ComposerComp
                        status={composerStatus}
                        prompt={prompt}
                        hasValidInput={hasValidInput}
                        placeholder={props.composerOptions?.placeholder}
                        autoFocus={props.composerOptions?.autoFocus}
                        submitShortcut={props.composerOptions?.submitShortcut}
                        onChange={handlePromptChange}
                        onSubmit={handleSubmitPrompt}
                    />
                </div>
            </div>
        </div>
    );
};
