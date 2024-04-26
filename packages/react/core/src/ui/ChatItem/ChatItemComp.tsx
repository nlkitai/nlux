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
    ref: Ref<ChatItemImperativeProps>,
) => ReactElement = function <AiMsg>(
    props: ChatItemProps<AiMsg>,
    ref: Ref<ChatItemImperativeProps>,
): ReactElement {
    const picture = useMemo(() => {
        if (props.picture === undefined && props.name === undefined) {
            return null;
        }

        return <AvatarComp name={props.name} picture={props.picture}/>;
    }, [props?.picture, props?.name]);

    const streamContainer = useRef<StreamContainerImperativeProps | null>(null);

    useImperativeHandle(ref, () => ({
        streamChunk: (chunk: string) => streamContainer?.current?.streamChunk(chunk),
        completeStream: () => streamContainer?.current?.completeStream(),
    }), []);

    const isStreaming = useMemo(
        () => props.status === 'streaming',
        [props.status],
    );

    const compDirectionClassName = props.direction
        ? compChatItemDirectionClassName[props.direction]
        : compChatItemDirectionClassName['incoming'];

    const className = `${compChatItemClassName} ${compDirectionClassName}`;
    const MessageRenderer = useMemo(() => createMessageRenderer(props), [
        props.message,
        props.customRenderer,
        props.direction,
        props.syntaxHighlighter,
        props.openLinksInNewWindow,
    ]);

    const ForwardRefStreamContainerComp = useMemo(() => forwardRef(
        StreamContainerComp,
    ), []);

    return (
        <div className={className}>
            {picture}
            {isStreaming && (
                <ForwardRefStreamContainerComp
                    key={'do-not-change'}
                    uid={props.uid}
                    status={'streaming'}
                    direction={props.direction}
                    ref={streamContainer}
                    markdownOptions={{
                        syntaxHighlighter: props.syntaxHighlighter,
                        openLinksInNewWindow: props.openLinksInNewWindow,
                    }}
                />
            )}
            {!isStreaming && (
                <MessageComp
                    uid={props.uid}
                    message={MessageRenderer}
                    status={props.status}
                    loader={props.loader}
                    direction={props.direction}
                />
            )}
        </div>
    );
};
