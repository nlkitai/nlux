import {MessageDirection, ParticipantRole} from '@nlux/core';
import React, {createRef, forwardRef, ReactNode, Ref, RefObject, useImperativeHandle, useMemo} from 'react';
import {ChatItemComp} from '../ChatItem/ChatItemComp';
import {ChatItemImperativeProps} from '../ChatItem/props';
import {WelcomeMessageComp} from '../WelcomeMessage/WelcomeMessageComp';
import {ConversationCompProps, ImperativeConversationCompProps} from './props';

const roleToDirection = (role: ParticipantRole): MessageDirection => {
    switch (role) {
        case 'user':
            return 'outgoing';
    }

    return 'incoming';
};

const pictureFromMessageAndPersona = (role: ParticipantRole, personaOptions: ConversationCompProps<unknown>['personaOptions']) => {
    if (role === 'ai') {
        return personaOptions?.bot?.picture;
    }

    if (role === 'user') {
        return personaOptions?.user?.picture;
    }

    return undefined;
};

const nameFromMessageAndPersona = (role: ParticipantRole, personaOptions: ConversationCompProps<unknown>['personaOptions']) => {
    if (role === 'ai') {
        return personaOptions?.bot?.name;
    }

    if (role === 'user') {
        return personaOptions?.user?.name;
    }

    return undefined;

};

export type ConversationCompType = <MessageType>(
    props: ConversationCompProps<MessageType>,
    ref: Ref<ImperativeConversationCompProps>,
) => ReactNode;

export const ConversationComp: ConversationCompType = (
    props,
    ref,
) => {
    const {messages, personaOptions} = props;
    const hasMessages = messages && messages.length > 0;
    const hasAiPersona = personaOptions?.bot?.name && personaOptions.bot.picture;
    const showWelcomeMessage = hasAiPersona && !hasMessages;

    const conversationItemsRef = useMemo(
        () => new Map<string, RefObject<ChatItemImperativeProps>>(), [],
    );

    useImperativeHandle(ref, () => ({
        scrollToBottom: () => {
            // TODO - Implement scroll to bottom
        },
        streamChunk: (messageId: string, chunk: string) => {
            const messageCompRef = conversationItemsRef.get(messageId);
            if (messageCompRef?.current) {
                messageCompRef.current.streamChunk(chunk);
            }
        },
    }), []);

    return (
        <>
            {showWelcomeMessage && (
                <WelcomeMessageComp
                    name={props.personaOptions!.bot!.name}
                    picture={props.personaOptions!.bot!.picture}
                    message={props.personaOptions!.bot!.tagline}
                />

            )}
            {hasMessages && messages.map((message) => {
                let ref: RefObject<ChatItemImperativeProps> | undefined = conversationItemsRef.get(
                    message.id);
                if (!ref) {
                    ref = createRef<ChatItemImperativeProps>();
                    conversationItemsRef.set(message.id, ref);
                }

                const ForwardRefChatItemComp = forwardRef(
                    ChatItemComp<any>,
                );

                return (
                    <ForwardRefChatItemComp
                        ref={ref}
                        key={message.id}
                        id={message.id}
                        status={message.status}
                        direction={roleToDirection(message.role)}
                        message={message.message}
                        customRenderer={props.customAiMessageComponent}
                        name={nameFromMessageAndPersona(message.role, props.personaOptions)}
                        picture={pictureFromMessageAndPersona(message.role, props.personaOptions)}
                    />
                );
            })}
        </>
    );
};
