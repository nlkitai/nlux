import {className as conversationItemCoreClassName} from '@nlux-dev/core/src/comp/ConversationItem/create';
import {directionClassName} from '@nlux-dev/core/src/comp/ConversationItem/utils/applyNewDirectionClassName';
import React, {ReactElement, ReactNode, useMemo} from 'react';
import {ChatPictureComp} from '../ChatPicture/ChatPictureComp';
import {MessageComp} from '../Message/MessageComp';
import {CustomConversationItemProps} from './props';

export const CustomConversationItemComp: <MessageType>(
    props: CustomConversationItemProps<MessageType>,
) => ReactElement = (
    props,
) => {
    const picture = useMemo(() => {
        if (props.picture === undefined && props.name === undefined) {
            return null;
        }

        return <ChatPictureComp name={props.name} picture={props.picture}/>;
    }, [props.picture, props.name]);

    const compDirectionClassName = props.direction
        ? directionClassName[props.direction]
        : directionClassName['incoming'];

    const className = `${conversationItemCoreClassName} ${compDirectionClassName}`;
    const message: ReactNode = props.customRender && props.message !== undefined
        ? props.customRender(props.message as any)
        : <>{props.message !== undefined ? props.message : ''}</>;

    return (
        <div className={className}>
            {picture}
            <MessageComp
                message={message}
                status={props.status}
                loader={props.loader}
                direction={props.direction}
            />
        </div>
    );
};
