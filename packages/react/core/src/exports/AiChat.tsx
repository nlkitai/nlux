import {forwardRef, ReactElement, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ChatSegment} from '../../../../shared/src/types/chatSegment/chatSegment';
import {createExceptionsBoxController} from '../../../../shared/src/ui/ExceptionsBox/control';
import {className as compExceptionsBoxClassName} from '../../../../shared/src/ui/ExceptionsBox/create';
import {PromptBoxStatus} from '../../../../shared/src/ui/PromptBox/props';
import {chatItemsToChatSegment} from '../../../../shared/src/utils/chat/chatItemsToChatSegment';
import {getRootClassNames} from '../../../../shared/src/utils/dom/getRootClassNames';
import {ConversationComp} from '../logic/Conversation/ConversationComp';
import {ImperativeConversationCompProps} from '../logic/Conversation/props';
import {PromptBoxComp} from '../ui/PromptBox/PromptBoxComp';
import {adapterParamToUsableAdapter} from '../utils/adapterParamToUsableAdapter';
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
        initialConversation,
        conversationOptions,
        promptBoxOptions,
        layoutOptions,
        className,
        themeId,
    } = props;

    // References to DOM elements and React components:
    // These are use for advanced interactions such as scrolling, streaming, and
    // exceptions animation that cannot be done with the usual React state and props.
    const conversationRef = useRef<ImperativeConversationCompProps>(null);
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
    const [promptBoxStatus, setPromptBoxStatus] = useState<PromptBoxStatus>('typing');
    const [initialSegment, setInitialSegment] = useState<ChatSegment<AiMsg>>();
    const [chatSegments, setChatSegments] = useState<ChatSegment<AiMsg>[]>([]);

    // Derived state and memoized values
    const segments = useMemo(
        () => (initialSegment ? [initialSegment, ...chatSegments] : chatSegments),
        [initialSegment, chatSegments],
    );

    const hasValidInput = useMemo(() => prompt.length > 0, [prompt]);
    const adapterToUse = useMemo(() => adapterParamToUsableAdapter<AiMsg>(adapter), [adapter]);
    const rootClassNames = useMemo(() => getRootClassNames({className, themeId}).join(' '), [className, themeId]);
    const rootStyle = useAiChatStyle(layoutOptions);

    // Callbacks and handlers for user interactions and events
    const showException = useCallback(
        (message: string) => exceptionBoxController?.displayException(message),
        [exceptionBoxController],
    );

    const handlePromptChange = useCallback((value: string) => setPrompt(value), [setPrompt]);
    const handleSubmitPrompt = useSubmitPromptHandler<AiMsg>({
        aiChatProps: props,
        adapterToUse, conversationRef,
        initialSegment, chatSegments,
        prompt, promptBoxOptions, showException,
        setChatSegments, setPromptBoxStatus, setPrompt,
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

    const ForwardConversationComp = useMemo(
        () => forwardRef(ConversationComp<AiMsg>), []);

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
                        responseRenderer={props.messageOptions?.responseComponent}
                        syntaxHighlighter={props.messageOptions?.syntaxHighlighter}
                        markdownLinkTarget={props.messageOptions?.markdownLinkTarget}
                        showCodeBlockCopyButton={props.messageOptions?.showCodeBlockCopyButton}
                        skipStreamingAnimation={props.messageOptions?.skipStreamingAnimation}
                        streamingAnimationSpeed={props.messageOptions?.streamingAnimationSpeed}
                        onLastActiveSegmentChange={handleLastActiveSegmentChange}
                    />
                </div>
                <div className="nlux-chtRm-prmptBox-cntr">
                    <PromptBoxComp
                        status={promptBoxStatus}
                        prompt={prompt}
                        hasValidInput={hasValidInput}
                        placeholder={props.promptBoxOptions?.placeholder}
                        autoFocus={props.promptBoxOptions?.autoFocus}
                        submitShortcut={props.promptBoxOptions?.submitShortcut}
                        onChange={handlePromptChange}
                        onSubmit={handleSubmitPrompt}
                    />
                </div>
            </div>
        </div>
    );
};
