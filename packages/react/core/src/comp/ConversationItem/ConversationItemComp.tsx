import React, {ReactElement} from 'react';
import {CustomConversationItemComp} from '../CustomConversationItem/CustomConversationItemComp';
import {ConversationItemProps} from './props';

export const ConversationItemComp: <MessageType>(
    props: ConversationItemProps<MessageType>,
) => ReactElement = (
    props,
) => {
    return (
        <CustomConversationItemComp
            direction={props.direction}
            status={props.status}
            message={props.message}
            customRender={props.customRenderer}
            loader={props.loader}
            name={props.name}
            picture={props.picture}
        />
    );
};
