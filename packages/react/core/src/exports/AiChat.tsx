import {
    ChatAdapterExtras,
    ChatSegment,
    compExceptionsBoxClassName,
    createExceptionsBoxController,
    PromptBoxStatus,
} from '@nlux/core';
import {CSSProperties, forwardRef, ReactElement, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {getRootClassNames} from '../../../../shared/src/dom/getRootClassNames';
import {useSubmitPromptHandler} from '../hooks/useSubmitPromptHandler/useSubmitPromptHandler';
import {ConversationComp} from '../logic/Conversation/ConversationComp';
import {ImperativeConversationCompProps} from '../logic/Conversation/props';
import {PromptBoxComp} from '../ui/PromptBox/PromptBoxComp';
import {adapterParamToUsableAdapter} from '../utils/adapterParamToUsableAdapter';
import {chatItemsToChatSegment} from '../utils/chatItemsToChatSegment';
import {reactPropsToCoreProps} from '../utils/reactPropsToCoreProps';
import {AiChatComponentProps} from './props';

export const AiChat: <MessageType>(
    props: AiChatComponentProps<MessageType>,
    t: MessageType,
) => ReactElement = function <MessageType>(
    props: AiChatComponentProps<MessageType>,
    t: MessageType,
): ReactElement {
    const conversationRef = useRef<ImperativeConversationCompProps>(null);
    const exceptionBoxRef = useRef<HTMLDivElement>(null);

    const exceptionBoxController = useMemo(() => {
        return exceptionBoxRef.current ? createExceptionsBoxController(exceptionBoxRef.current) : undefined;
    }, [exceptionBoxRef.current]);

    const showException = useCallback((message: string) => {
        exceptionBoxController?.displayException(message);
    }, [exceptionBoxController]);

    const [prompt, setPrompt] = useState('');
    const [promptBoxStatus, setPromptBoxStatus] = useState<PromptBoxStatus>('typing');
    const [initialSegment, setInitialSegment] = useState<ChatSegment<MessageType>>();
    const [chatSegments, setChatSegments] = useState<ChatSegment<MessageType>[]>([]);
    const setSegmentsRef = useRef({chatSegments, setChatSegments});

    const adapterToUse = useMemo(() => adapterParamToUsableAdapter(props.adapter), [props.adapter]);
    const adapterExtras: ChatAdapterExtras | undefined = useMemo(() => {
        if (adapterToUse) {
            return {aiChatProps: reactPropsToCoreProps(props, adapterToUse)};
        }
    }, [props, adapterToUse]);

    const hasValidInput = useMemo(() => prompt.length > 0, [prompt]);
    const handlePromptChange = useCallback((value: string) => setPrompt(value), [setPrompt]);
    const handleSubmitClick = useSubmitPromptHandler({
        adapterToUse,
        adapterExtras,
        prompt,
        promptBoxOptions: props.promptBoxOptions,
        showException,
        setSegmentsRef,
        conversationRef,
    });

    useEffect(() => {
        setSegmentsRef.current = {chatSegments, setChatSegments};
    }, [chatSegments, setChatSegments]);

    useEffect(() => {
        setInitialSegment(
            props.initialConversation
                ? chatItemsToChatSegment(props.initialConversation)
                : undefined,
        );
    }, [props.initialConversation]);

    const conversationSegments = useMemo(() => {
        return initialSegment ? [initialSegment, ...chatSegments] : chatSegments;
    }, [initialSegment, chatSegments]);

    const ForwardConversationComp = forwardRef(
        ConversationComp<MessageType>,
    );

    const rootClassNames = getRootClassNames({
        className: props.className,
        themeId: props.themeId,
    }).join(' ');

    const style: CSSProperties = useMemo(() => {
        const result: CSSProperties = {
            minWidth: '280px',
            minHeight: '280px',
        };

        if (props.layoutOptions?.width) {
            result.width = props.layoutOptions.width;
        }

        if (props.layoutOptions?.height) {
            result.height = props.layoutOptions.height;
        }

        return result;
    }, [props.layoutOptions?.width, props.layoutOptions?.height]);

    return (
        <div className={rootClassNames} style={style}>
            <div className={compExceptionsBoxClassName} ref={exceptionBoxRef}/>
            <div className="nlux-chtRm-cntr">
                <div className="nlux-chtRm-cnv-cntr">
                    <ForwardConversationComp
                        ref={conversationRef}
                        segments={conversationSegments}
                        conversationOptions={props.conversationOptions}
                        personaOptions={props.personaOptions}
                        customRenderer={props.aiMessageComponent}
                        syntaxHighlighter={props.syntaxHighlighter}
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
                        onSubmit={handleSubmitClick}
                    />
                </div>
            </div>
        </div>
    );
};
