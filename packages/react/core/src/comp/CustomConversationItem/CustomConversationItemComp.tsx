import {className as conversationItemCoreClassName} from '@nlux-dev/core/src/comp/ConversationItem/create';
import {directionClassName} from '@nlux-dev/core/src/comp/ConversationItem/utils/applyNewDirectionClassName';
import React, {forwardRef, ReactElement, ReactNode, Ref, useImperativeHandle, useMemo, useRef} from 'react';
import {ChatPictureComp} from '../ChatPicture/ChatPictureComp';
import {ImperativeConversationCompProps} from '../Conversation/props';
import {MessageComp} from '../Message/MessageComp';
import {StreamContainerComp} from '../StreamContainer/StreamContainerComp';
import {CustomConversationItemProps, ImperativeCustomConversationItemProps} from './props';

export const CustomConversationItemComp: <MessageType>(
    props: CustomConversationItemProps<MessageType>,
    ref: Ref<ImperativeCustomConversationItemProps>,
) => ReactElement = (
    props,
    ref,
) => {
    const picture = useMemo(() => {
        if (props.picture === undefined && props.name === undefined) {
            return null;
        }

        return <ChatPictureComp name={props.name} picture={props.picture}/>;
    }, [props.picture, props.name]);

    const streamContainer = useRef<{
        streamChunk: (chunk: string) => void;
    } | null>(null);

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
        ? directionClassName[props.direction]
        : directionClassName['incoming'];

    const className = `${conversationItemCoreClassName} ${compDirectionClassName}`;
    const message: ReactNode = useMemo(() => {
        if (props.customRenderer) {
            if (props.message === undefined) {
                return null;
            }

            return props.customRenderer(props.message as any);
        }

        return (
            <>{props.message !== undefined ? props.message : ''}</>
        );
    }, [props.customRenderer, props.message]);

    const ForwardRefStreamContainerComp = forwardRef(
        StreamContainerComp,
    );

    return (
        <div className={className}>
            {picture}
            <ForwardRefStreamContainerComp
                id={props.id}
                key={'do-not-change'} ref={streamContainer}
            />
            {!isStreaming && (
                <MessageComp
                    id={props.id}
                    message={message}
                    status={props.status}
                    loader={props.loader}
                    direction={props.direction}
                />
            )}
        </div>
    );
};
