import {forwardRef, ReactElement, Ref, useCallback, useImperativeHandle, useMemo, useRef} from 'react';
import {className as compChatItemClassName} from '@shared/components/ChatItem/create';
import {
    directionClassName as compChatItemDirectionClassName,
} from '@shared/components/ChatItem/utils/applyNewDirectionClassName';
import {conversationLayoutClassName} from '@shared/components/ChatItem/utils/applyNewLayoutClassName';
import {MarkdownSnapshotRenderer} from '../MessageRenderer/MarkdownSnapshotRenderer';
import {getMessageRenderer} from '../MessageRenderer/MessageRenderer';
import {StreamContainerImperativeProps} from '../StreamContainer/props';
import {StreamContainerComp} from '../StreamContainer/StreamContainerComp';
import {AvatarComp} from '../../components/Avatar/AvatarComp';
import {MessageComp} from '../../components/Message/MessageComp';
import {ChatItemImperativeProps, ChatItemProps} from './props';

export const ChatItemComp: <AiMsg>(
    props: ChatItemProps<AiMsg>,
    ref: Ref<ChatItemImperativeProps<AiMsg>>,
) => ReactElement = function <AiMsg>(
    props: ChatItemProps<AiMsg>,
    ref: Ref<ChatItemImperativeProps<AiMsg>>,
): ReactElement {
    const participantInfo = useMemo(() => {
        return (
            <div className="nlux-comp-chatItem-participantInfo">
                {(props.avatar !== undefined) && (
                    <AvatarComp name={props.name} avatar={props.avatar}/>
                )}
                <span className="nlux-comp-chatItem-participantName">{props.name}</span>
            </div>
        );

    }, [props.avatar, props.name]);

    const streamContainer = useRef<StreamContainerImperativeProps<AiMsg> | null>(null);

    useImperativeHandle(ref, () => ({
        streamChunk: (chunk: AiMsg) => streamContainer?.current?.streamChunk(chunk),
        completeStream: () => streamContainer?.current?.completeStream(),
    }), []);

    const compDirectionClassName = props.direction
        ? compChatItemDirectionClassName[props.direction]
        : compChatItemDirectionClassName['received'];

    const compConStyleClassName = props.layout === 'bubbles'
        ? conversationLayoutClassName['bubbles']
        : conversationLayoutClassName['list'];

    const className = `${compChatItemClassName} ${compDirectionClassName} ${compConStyleClassName} ${compConStyleClassName}`;
    const AiMessageRenderer = useMemo(
        () => getMessageRenderer<AiMsg>(props), [
            props.uid,
            props.status,
            props.dataTransferMode,
            props.fetchedContent,
            props.streamedContent,
            props.direction,
            props.messageOptions?.responseRenderer, props.messageOptions?.syntaxHighlighter,
            props.messageOptions?.htmlSanitizer, props.messageOptions?.markdownLinkTarget,
        ],
    );

    const UserMessageRenderer = useCallback(() => {
        if (props.messageOptions?.promptRenderer === undefined) {
            return (
                <MarkdownSnapshotRenderer
                    messageUid={props.uid}
                    content={props.fetchedContent as string}
                    markdownOptions={{
                        htmlSanitizer: props.messageOptions?.htmlSanitizer,
                        // User message does not need syntax highlighting, advanced markdown options
                        // Only HTML sanitization is needed
                    }}
                />
            );
        }

        return props.messageOptions?.promptRenderer({uid: props.uid, prompt: props.fetchedContent as string});
    }, [props.messageOptions?.promptRenderer, props.fetchedContent, props.uid]);

    const ForwardRefStreamContainerComp = useMemo(() => forwardRef(
        StreamContainerComp<AiMsg>,
    ), []);

    const isAssistantMessage = props.direction === 'received';
    const isUserMessage = props.direction === 'sent';
    const isStreamed = props.dataTransferMode === 'stream';

    return (
        <div className={className}>
            {participantInfo}
            {isAssistantMessage && isStreamed && (
                <ForwardRefStreamContainerComp
                    key={'do-not-change'}
                    uid={props.uid}
                    status={props.status}
                    ref={streamContainer}
                    direction={props.direction}
                    responseRenderer={props.messageOptions?.responseRenderer}
                    markdownOptions={{
                        syntaxHighlighter: props.messageOptions?.syntaxHighlighter,
                        htmlSanitizer: props.messageOptions?.htmlSanitizer,
                        markdownLinkTarget: props.messageOptions?.markdownLinkTarget,
                        showCodeBlockCopyButton: props.messageOptions?.showCodeBlockCopyButton,
                        skipStreamingAnimation: props.messageOptions?.skipStreamingAnimation,
                        streamingAnimationSpeed: props.messageOptions?.streamingAnimationSpeed,
                    }}
                />
            )}
            {isAssistantMessage && !isStreamed && (
                <MessageComp
                    uid={props.uid}
                    message={AiMessageRenderer}
                    status={props.status}
                    direction={props.direction}
                />
            )}
            {isUserMessage && (
                <MessageComp
                    uid={props.uid}
                    message={UserMessageRenderer}
                    status={props.status}
                    direction={props.direction}
                />
            )}
        </div>
    );
};
