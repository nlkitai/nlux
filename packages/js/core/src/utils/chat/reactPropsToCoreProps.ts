import {AiChatProps as AiChatCoreProps} from '@nlux/core';
import {AiChatComponentProps} from '@nlux/react';
import {BotPersona, UserPersona} from '../../core/aiChat/options/personaOptions';
import {ChatAdapter} from '../../types/adapters/chat/chatAdapter';
import {StandardChatAdapter} from '../../types/adapters/chat/standardChatAdapter';

export const reactPropsToCoreProps = <MessageType>(
    props: AiChatComponentProps<MessageType>,
    adapterToUse: ChatAdapter | StandardChatAdapter,
): AiChatCoreProps => {
    const botProp = props.personaOptions?.bot;
    const bot: BotPersona | undefined = botProp ? {
        name: botProp.name,
        picture: typeof botProp.picture === 'string' ? botProp.picture : '<REACT ELEMENT>',
        tagline: botProp.tagline,
    } : undefined;

    const userProp = props.personaOptions?.user;
    const user: UserPersona | undefined = userProp ? {
        name: userProp.name,
        picture: typeof userProp.picture === 'string' ? userProp.picture : '<REACT ELEMENT>',
    } : undefined;

    return {
        adapter: adapterToUse,
        events: props.events,
        className: props.className,
        promptBoxOptions: props.promptBoxOptions,
        conversationOptions: props.conversationOptions,
        personaOptions: {
            bot,
            user,
        },
        layoutOptions: props.layoutOptions,
        syntaxHighlighter: props.syntaxHighlighter,
    };
};
