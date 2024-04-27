import {AiChatProps as AiChatCoreProps, ChatAdapter, StandardChatAdapter} from '@nlux/core';
import {AiChatProps} from '../exports/props';

export const reactPropsToCoreProps = <AiMsg>(
    props: AiChatProps<AiMsg>,
    adapterToUse: ChatAdapter<AiMsg> | StandardChatAdapter<AiMsg>,
): AiChatCoreProps<AiMsg> => {
    const botProp = props.personaOptions?.bot;
    const userProp = props.personaOptions?.user;

    return {
        adapter: adapterToUse,
        events: props.events,
        className: props.className,
        themeId: props.themeId,
        layoutOptions: props.layoutOptions,
        conversationOptions: props.conversationOptions,
        messageOptions: props.messageOptions,
        promptBoxOptions: props.promptBoxOptions,
        personaOptions: {
            bot: botProp ? {
                name: botProp.name,
                picture: typeof botProp.picture === 'string' ? botProp.picture : '<REACT ELEMENT />',
                tagline: botProp.tagline,
            } : undefined,
            user: userProp ? {
                name: userProp.name,
                picture: typeof userProp.picture === 'string' ? userProp.picture : '<REACT ELEMENT />',
            } : undefined,
        },
    };
};
