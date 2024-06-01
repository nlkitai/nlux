import {forwardRef, ReactElement, Ref, useCallback, useImperativeHandle, useMemo, useRef} from 'react';
import {className as compChatItemClassName} from '../../../../../shared/src/components/ChatItem/create';
import {
    directionClassName as compChatItemDirectionClassName,
} from '../../../../../shared/src/components/ChatItem/utils/applyNewDirectionClassName';
import {conversationLayoutClassName} from '../../../../../shared/src/components/ChatItem/utils/applyNewLayoutClassName';
import {MarkdownSnapshotRenderer} from '../../logic/MessageRenderer/MarkdownSnapshotRenderer';
import {createMessageRenderer} from '../../logic/MessageRenderer/MessageRenderer';
import {StreamContainerImperativeProps} from '../../logic/StreamContainer/props';
import {StreamContainerComp} from '../../logic/StreamContainer/StreamContainerComp';
import {AvatarComp} from '../Avatar/AvatarComp';
import {MessageComp} from '../Message/MessageComp';
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
            <div className="nlux-comp-cht_itm-prt_info">
                {(props.avatar !== undefined) && (
                    <AvatarComp name={props.name} avatar={props.avatar}/>
                )}
                <span className="nlux-comp-cht_itm-prt_name">{props.name}</span>
            </div>
        );

    }, [props.avatar, props.name]);

    const isStreaming = useMemo(() => props.status === 'streaming', [props.status]);
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
    const AiMessageRenderer = useMemo(() => {
        return isStreaming ? () => '' : createMessageRenderer<AiMsg>(props);
    }, [
        isStreaming,
        props.uid, props.status, props.fetchedContent, props.streamedContent, props.direction,
        props.responseRenderer, props.syntaxHighlighter, props.htmlSanitizer, props.markdownLinkTarget,
    ]);

    const UserMessageRenderer = useCallback(() => {
        if (props.promptRenderer === undefined) {
            return (
                <MarkdownSnapshotRenderer
                    messageUid={props.uid}
                    content={props.fetchedContent as string}
                    markdownOptions={{
                        htmlSanitizer: props.htmlSanitizer,
                    }}
                />
            );
        }

        return props.promptRenderer({uid: props.uid, prompt: props.fetchedContent as string});
    }, [props.promptRenderer, props.fetchedContent, props.uid,]);

    const ForwardRefStreamContainerComp = useMemo(() => forwardRef(
        StreamContainerComp<AiMsg>,
    ), []);

    return (
        <div className={className}>
            {participantInfo}
            {isStreaming && (
                <ForwardRefStreamContainerComp
                    key={'do-not-change'}
                    uid={props.uid}
                    status={'streaming'}
                    ref={streamContainer}
                    direction={props.direction}
                    responseRenderer={props.responseRenderer}
                    markdownOptions={{
                        syntaxHighlighter: props.syntaxHighlighter,
                        htmlSanitizer: props.htmlSanitizer,
                        markdownLinkTarget: props.markdownLinkTarget,
                        showCodeBlockCopyButton: props.showCodeBlockCopyButton,
                        skipStreamingAnimation: props.skipStreamingAnimation,
                        streamingAnimationSpeed: props.streamingAnimationSpeed,
                    }}
                />
            )}
            {!isStreaming && props.direction === 'received' && (
                <MessageComp
                    uid={props.uid}
                    message={AiMessageRenderer}
                    status={props.status}
                    direction={props.direction}
                />
            )}
            {!isStreaming && props.direction === 'sent' && (
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
