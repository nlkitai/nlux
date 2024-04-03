import {MessageDirection, ParticipantRole} from '@nlux/core';
import React, {ReactNode, useImperativeHandle} from 'react';
import {ConversationItemComp} from '../ConversationItem/ConversationItemComp';
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
    ref: React.Ref<ImperativeConversationCompProps>,
) => ReactNode;

export const ConversationComp: ConversationCompType = (
    props,
    ref,
) => {
    const {messages, personaOptions} = props;
    const hasMessages = messages && messages.length > 0;
    const hasAiPersona = personaOptions?.bot?.name && personaOptions.bot.picture;
    const showWelcomeMessage = hasAiPersona && !hasMessages;

    useImperativeHandle(ref, () => ({
        scrollToBottom: () => {
            // TODO - Implement scroll to bottom
        },
        streamChunk: (messageId: string, chunk: string) => {
            console.log('streamChunk', messageId, chunk);
            // TODO - Implement stream chunk
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
                return (
                    <ConversationItemComp
                        key={message.id}
                        status={'rendered'}
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
