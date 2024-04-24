import {ChatAdapterExtras} from '@nlux/core';
import {forwardRef, ReactElement, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ChatSegment} from '../../../../shared/src/types/chatSegment/chatSegment';
import {createExceptionsBoxController} from '../../../../shared/src/ui/ExceptionsBox/control';
import {className as compExceptionsBoxClassName} from '../../../../shared/src/ui/ExceptionsBox/create';
import {PromptBoxStatus} from '../../../../shared/src/ui/PromptBox/props';
import {getRootClassNames} from '../../../../shared/src/utils/dom/getRootClassNames';
import {ConversationComp} from '../logic/Conversation/ConversationComp';
import {ImperativeConversationCompProps} from '../logic/Conversation/props';
import {PromptBoxComp} from '../ui/PromptBox/PromptBoxComp';
import {adapterParamToUsableAdapter} from '../utils/adapterParamToUsableAdapter';
import {chatItemsToChatSegment} from '../utils/chatItemsToChatSegment';
import {reactPropsToCoreProps} from '../utils/reactPropsToCoreProps';
import {useAiChatStyle} from './hooks/useAiChatStyle';
import {useAutoScrollHandler} from './hooks/useAutoScrollHandler';
import {useSubmitPromptHandler} from './hooks/useSubmitPromptHandler';
import {AiChatComponentProps} from './props';

const defaultAutoScrollOption = true;

export const AiChat: <AiMsg>(
    props: AiChatComponentProps<AiMsg>,
) => ReactElement = function <AiMsg>(
    props: AiChatComponentProps<AiMsg>,
): ReactElement {
    const conversationRef = useRef<ImperativeConversationCompProps>(null);
    const exceptionBoxRef = useRef<HTMLDivElement>(null);
    const conversationContainerRef = useRef<HTMLDivElement>(null);
    const autoScrollHandler = useAutoScrollHandler(
        conversationContainerRef,
        props.conversationOptions?.autoScroll,
    );

    const exceptionBoxController = useMemo(() => {
        return exceptionBoxRef.current ? createExceptionsBoxController(exceptionBoxRef.current) : undefined;
    }, [exceptionBoxRef.current]);

    const showException = useCallback((message: string) => {
        exceptionBoxController?.displayException(message);
    }, [exceptionBoxController]);

    const [prompt, setPrompt] = useState('');
    const [promptBoxStatus, setPromptBoxStatus] = useState<PromptBoxStatus>('typing');
    const [initialSegment, setInitialSegment] = useState<ChatSegment<AiMsg>>();
    const [chatSegments, setChatSegments] = useState<ChatSegment<AiMsg>[]>([]);

    const adapterToUse = useMemo(
        () => adapterParamToUsableAdapter<AiMsg>(props.adapter), [props.adapter],
    );

    const adapterExtras: ChatAdapterExtras<AiMsg> | undefined = useMemo(() => (
        adapterToUse ? {aiChatProps: reactPropsToCoreProps<AiMsg>(props, adapterToUse)} : undefined
    ), [props, adapterToUse]);

    const lastActiveSegmentIdRef = useRef<string | undefined>(undefined);
    const hasValidInput = useMemo(() => prompt.length > 0, [prompt]);
    const handlePromptChange = useCallback((value: string) => setPrompt(value), [setPrompt]);
    const handleSubmitPrompt = useSubmitPromptHandler({
        adapterToUse,
        adapterExtras,
        prompt,
        promptBoxOptions: props.promptBoxOptions,
        showException,
        chatSegments,
        setChatSegments,
        setPromptBoxStatus,
        conversationRef,
    });

    useEffect(() => setInitialSegment(
        props.initialConversation ? chatItemsToChatSegment(props.initialConversation) : undefined,
    ), [props.initialConversation]);

    const handleLastActiveSegmentChange = useCallback((data: {uid: string; div: HTMLDivElement} | undefined) => {
        if (!autoScrollHandler) {
            return;
        }

        if (data) {
            lastActiveSegmentIdRef.current = data.uid;
            autoScrollHandler.handleNewChatSegmentAdded(data.uid, data.div);
        } else {
            if (lastActiveSegmentIdRef.current) {
                autoScrollHandler.handleChatSegmentRemoved(lastActiveSegmentIdRef.current);
            }
        }
    }, [autoScrollHandler]);

    const segments = useMemo(() => (
        initialSegment ? [initialSegment, ...chatSegments] : chatSegments
    ), [initialSegment, chatSegments]);

    const rootStyle = useAiChatStyle(props.layoutOptions);
    const rootClassNames = getRootClassNames({
        className: props.className,
        themeId: props.themeId,
    }).join(' ');

    const ForwardConversationComp = useMemo(() => forwardRef(
        ConversationComp<AiMsg>,
    ), []);

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
                        customRenderer={props.aiMessageComponent}
                        syntaxHighlighter={props.syntaxHighlighter}
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
