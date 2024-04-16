import {AiChatProps, ChatAdapter, StandardChatAdapter} from '@nlux/core';
import {AiChatComponentProps} from '../exports/props';

export const reactPropsToCoreProps = <AiMsg>(
    props: AiChatComponentProps<AiMsg>,
    adapterToUse: ChatAdapter<AiMsg> | StandardChatAdapter<AiMsg>,
): AiChatProps<AiMsg> => {
    const botProp = props.personaOptions?.bot;
    const userProp = props.personaOptions?.user;

    return {
        adapter: adapterToUse,
        events: props.events,
        className: props.className,
        promptBoxOptions: props.promptBoxOptions,
        conversationOptions: props.conversationOptions,
        personaOptions: {
            bot: botProp ? {
                name: botProp.name,
                picture: typeof botProp.picture === 'string' ? botProp.picture : '<REACT ELEMENT>',
                tagline: botProp.tagline,
            } : undefined,
            user: userProp ? {
                name: userProp.name,
                picture: typeof userProp.picture === 'string' ? userProp.picture : '<REACT ELEMENT>',
            } : undefined,
        },
        layoutOptions: props.layoutOptions,
        syntaxHighlighter: props.syntaxHighlighter,
    };
};
