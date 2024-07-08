import {className as compMessageClassName} from '@shared/components/Message/create';
import {
    directionClassName as compMessageDirectionClassName
} from '@shared/components/Message/utils/applyNewDirectionClassName';
import {statusClassName as compMessageStatusClassName} from '@shared/components/Message/utils/applyNewStatusClassName';
import {
    forwardRef,
    ReactElement,
    ReactNode,
    Ref,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react';
import {className as compChatItemClassName} from '@shared/components/ChatItem/create';
import {
    directionClassName as compChatItemDirectionClassName,
} from '@shared/components/ChatItem/utils/applyNewDirectionClassName';
import {conversationLayoutClassName} from '@shared/components/ChatItem/utils/applyNewLayoutClassName';
import {StreamContainerImperativeProps} from '../StreamContainer/props';
import {StreamContainerComp} from '../StreamContainer/StreamContainerComp';
import {useAssistantMessageRenderer} from './hooks/useAssistantMessageRenderer';
import {useParticipantInfoRenderer} from './hooks/userParticipantInfoRenderer';
import {ChatItemImperativeProps, ChatItemProps} from './props';
import {useUserMessageRenderer} from './hooks/useUserMessageRenderer';

export const ChatItemComp: <AiMsg>(
    props: ChatItemProps<AiMsg>,
    ref: Ref<ChatItemImperativeProps<AiMsg>>,
) => ReactElement = function <AiMsg>(
    props: ChatItemProps<AiMsg>,
    ref: Ref<ChatItemImperativeProps<AiMsg>>,
): ReactElement {
    const streamContainer = useRef<
        StreamContainerImperativeProps<AiMsg> | null>(null);

    useImperativeHandle(ref, () => ({
        streamChunk: (chunk: AiMsg) => setTimeout(() => streamContainer?.current?.streamChunk(chunk)),
        completeStream: () => setTimeout(() => streamContainer?.current?.completeStream()),
        cancelStream: () => streamContainer?.current?.cancelStream(),
    }), []);

    const isServerComponent = props.contentType === 'server-component';
    const isAssistantMessage = props.direction === 'received';
    const isUserMessage = props.direction === 'sent';
    const isStreamed = props.dataTransferMode === 'stream';
    const isPartOfInitialSegment = props.isPartOfInitialSegment;

    const markdownStreamRenderedCallback = useCallback(() => props.onMarkdownStreamRendered?.(props.uid), [props.uid]);
    useEffect(() => {
        if (!isStreamed && !isServerComponent && !isPartOfInitialSegment) {
            props.onMarkdownStreamRendered?.(props.uid);
        }
    }, []);

    const AssistantBatchedMessage = useAssistantMessageRenderer(props);
    const UserMessage = useUserMessageRenderer(props);
    const ForwardRefStreamContainerComp = useMemo( () => forwardRef(StreamContainerComp<AiMsg>), []);
    const ParticipantInfo = useParticipantInfoRenderer(props);

    const directionClassNameForChatItem = props.direction ? compChatItemDirectionClassName[props.direction] : compChatItemDirectionClassName['received'];
    const convStyleClassName = props.layout === 'bubbles' ? conversationLayoutClassName['bubbles'] : conversationLayoutClassName['list'];
    const containerClassName = `${compChatItemClassName} ${directionClassNameForChatItem} ${convStyleClassName}`;

    const messageStatusClassName = props.status ? compMessageStatusClassName[props.status] : compMessageStatusClassName['rendered'];
    const messageDirectionClassName = props.direction ? compMessageDirectionClassName[props.direction] : compMessageDirectionClassName['received'];
    const messageClassName = `${compMessageClassName} ${messageStatusClassName} ${messageDirectionClassName}`;

    return (
        <div className={containerClassName}>
            <ParticipantInfo />
            {isAssistantMessage && isStreamed && !isServerComponent && (
                <ForwardRefStreamContainerComp
                    key={'do-not-change'}
                    uid={props.uid}
                    status={props.status}
                    ref={streamContainer}
                    direction={props.direction}
                    responseRenderer={props.messageOptions?.responseRenderer}
                    markdownContainersController={props.markdownContainersController}
                    markdownOptions={{
                        syntaxHighlighter: props.messageOptions?.syntaxHighlighter,
                        htmlSanitizer: props.messageOptions?.htmlSanitizer,
                        markdownLinkTarget: props.messageOptions?.markdownLinkTarget,
                        showCodeBlockCopyButton: props.messageOptions?.showCodeBlockCopyButton,
                        skipStreamingAnimation: props.messageOptions?.skipStreamingAnimation,
                        streamingAnimationSpeed: props.messageOptions?.streamingAnimationSpeed,
                        waitTimeBeforeStreamCompletion: props.messageOptions?.waitTimeBeforeStreamCompletion,
                        onStreamComplete: markdownStreamRenderedCallback,
                    }}
                />
            )}
            {isAssistantMessage && isStreamed && isServerComponent && (
                <div className={messageClassName}>
                    {props.fetchedContent as ReactNode}
                </div>
            )}
            {isAssistantMessage && !isStreamed && (
                <div className={messageClassName}>
                    <AssistantBatchedMessage />
                </div>
            )}
            {isUserMessage && (
                <div className={messageClassName}>
                    <UserMessage />
                </div>
            )}
        </div>
    );
};
