import {forwardRef, ReactElement, Ref, useImperativeHandle, useMemo, useRef} from 'react';
import {className as compChatItemClassName} from '../../../../../shared/src/ui/ChatItem/create';
import {
    directionClassName as compChatItemDirectionClassName,
} from '../../../../../shared/src/ui/ChatItem/utils/applyNewDirectionClassName';
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
    const picture = useMemo(() => {
        if (props.picture === undefined && props.name === undefined) {
            return null;
        }

        return <AvatarComp name={props.name} picture={props.picture}/>;
    }, [props?.picture, props?.name]);

    const isStreaming = useMemo(() => props.status === 'streaming', [props.status]);
    const streamContainer = useRef<StreamContainerImperativeProps<AiMsg> | null>(null);

    useImperativeHandle(ref, () => ({
        streamChunk: (chunk: AiMsg) => streamContainer?.current?.streamChunk(chunk),
        completeStream: () => streamContainer?.current?.completeStream(),
    }), []);

    const compDirectionClassName = props.direction
        ? compChatItemDirectionClassName[props.direction]
        : compChatItemDirectionClassName['incoming'];

    const className = `${compChatItemClassName} ${compDirectionClassName}`;
    const MessageRenderer = useMemo(() => {
        return isStreaming ? () => '' : createMessageRenderer<AiMsg>(props);
    }, [
        isStreaming,
        props.uid, props.status, props.fetchedContent, props.streamedContent, props.direction,
        props.responseRenderer, props.syntaxHighlighter, props.markdownLinkTarget,
    ]);

    const ForwardRefStreamContainerComp = useMemo(() => forwardRef(
        StreamContainerComp<AiMsg>,
    ), []);

    return (
        <div className={className}>
            {picture}
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
                        markdownLinkTarget: props.markdownLinkTarget,
                        showCodeBlockCopyButton: props.showCodeBlockCopyButton,
                        skipStreamingAnimation: props.skipStreamingAnimation,
                        streamingAnimationSpeed: props.streamingAnimationSpeed,
                    }}
                />
            )}
            {!isStreaming && (
                <MessageComp
                    uid={props.uid}
                    message={MessageRenderer}
                    status={props.status}
                    direction={props.direction}
                />
            )}
        </div>
    );
};
