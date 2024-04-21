import {FC, forwardRef, ReactElement, Ref, useImperativeHandle, useMemo, useRef} from 'react';
import {className as compChatItemClassName} from '../../../../../shared/src/ui/ChatItem/create';
import {
    directionClassName as compChatItemDirectionClassName,
} from '../../../../../shared/src/ui/ChatItem/utils/applyNewDirectionClassName';
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
    }, [props.picture, props.name]);

    const streamContainer = useRef<StreamContainerImperativeProps | null>(null);

    useImperativeHandle(ref, () => ({
        streamChunk: (chunk: string) => {
            if (streamContainer?.current) {
                streamContainer.current.streamChunk(chunk);
            }
        },
    }), []);

    const isStreaming = useMemo(
        () => props.status === 'streaming',
        [props.status],
    );

    const compDirectionClassName = props.direction
        ? compChatItemDirectionClassName[props.direction]
        : compChatItemDirectionClassName['incoming'];

    const className = `${compChatItemClassName} ${compDirectionClassName}`;
    const MessageRenderer: FC<void> = useMemo(() => {
        if (props.customRenderer) {
            if (props.message === undefined) {
                return () => null;
            }

            return () => props.customRenderer ? props.customRenderer({
                message: props.message as AiMsg,
            }) : null;
        }

        // TODO - Markdown support
        return () => <>{props.message !== undefined ? props.message : ''}</>;
    }, [props.customRenderer, props.message]);

    const ForwardRefStreamContainerComp = forwardRef(
        StreamContainerComp,
    );

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
