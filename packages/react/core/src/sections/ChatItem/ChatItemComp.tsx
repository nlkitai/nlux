import {forwardRef, ReactElement, ReactNode, Ref, useCallback, useImperativeHandle, useMemo, useRef} from 'react';
import {className as compChatItemClassName} from '@shared/components/ChatItem/create';
import {
    directionClassName as compChatItemDirectionClassName,
} from '@shared/components/ChatItem/utils/applyNewDirectionClassName';
import {conversationLayoutClassName} from '@shared/components/ChatItem/utils/applyNewLayoutClassName';
import {StreamContainerImperativeProps} from '../StreamContainer/props';
import {StreamContainerComp} from '../StreamContainer/StreamContainerComp';
import {MessageComp} from '../../components/Message/MessageComp';
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

    const markdownStreamRendered = useCallback(
        () => {
            props.onMarkdownStreamRendered?.(props.uid);
        },
        [props.uid],
    );

    const AiMessage = useAssistantMessageRenderer(props);
    const UserMessage = useUserMessageRenderer(props);
    const ParticipantInfo = useParticipantInfoRenderer(props);

    const ForwardRefStreamContainerComp = useMemo(
        () => forwardRef(StreamContainerComp<AiMsg>),
        [],
    );

    const isServerComponent = props.contentType === 'server-component';
    const isAssistantMessage = props.direction === 'received';
    const isUserMessage = props.direction === 'sent';
    const isStreamed = props.dataTransferMode === 'stream';

    const compDirectionClassName = props.direction
        ? compChatItemDirectionClassName[props.direction]
        : compChatItemDirectionClassName['received'];

    const compConStyleClassName = props.layout === 'bubbles'
        ? conversationLayoutClassName['bubbles']
        : conversationLayoutClassName['list'];

    const className = `${compChatItemClassName} ${compDirectionClassName} ` +
        `${compConStyleClassName} ${compConStyleClassName}`;

    return (
        <div className={className}>
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
                        onStreamComplete: markdownStreamRendered,
                    }}
                />
            )}
            {isAssistantMessage && isStreamed && isServerComponent && (
                <MessageComp
                    uid={props.uid}
                    message={props.fetchedContent as ReactNode}
                    status={props.status}
                    contentType={'server-component'}
                    direction={props.direction}
                />
            )}
            {isAssistantMessage && !isStreamed && (
                <MessageComp
                    uid={props.uid}
                    message={AiMessage}
                    status={props.status}
                    contentType={'text'}
                    direction={props.direction}
                />
            )}
            {isUserMessage && (
                <MessageComp
                    uid={props.uid}
                    message={UserMessage}
                    status={props.status}
                    contentType={'text'}
                    direction={props.direction}
                />
            )}
        </div>
    );
};
