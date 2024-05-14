import {AiChatPropsInEvents, PersonaOptions} from '@nlux/core';
import {AiChatProps} from '../exports/props';

export const reactPropsToCorePropsInEvents = <AiMsg>(
    props: AiChatProps<AiMsg>,
): AiChatPropsInEvents<AiMsg> => {

    const result: AiChatPropsInEvents<AiMsg> = {};
    const keys = Object.keys(props);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i] as keyof AiChatProps<AiMsg>;
        if (
            key === 'personaOptions' ||
            key === 'messageOptions' ||
            key === 'adapter' ||
            key === 'events'
        ) {
            continue;
        }

        Object.assign(result, {[key]: props[key]});
    }

    if (props.personaOptions) {
        result.personaOptions = {} as PersonaOptions;
        if (props.personaOptions.bot) {
            result.personaOptions.bot = {
                name: props.personaOptions.bot.name,
                picture: typeof props.personaOptions.bot.picture === 'string'
                    ? props.personaOptions.bot.picture
                    : '<REACT ELEMENT />',
                tagline: props.personaOptions.bot.tagline,
            };
        }

        if (props.personaOptions.user) {
            result.personaOptions.user = {
                name: props.personaOptions.user.name,
                picture: typeof props.personaOptions.user.picture === 'string'
                    ? props.personaOptions.user.picture
                    : '<REACT ELEMENT />',
            };
        }
    }

    if (props.messageOptions) {
        result.messageOptions = {
            ...props.messageOptions,
            responseRenderer: props.messageOptions.responseComponent ? () => null : undefined,
            promptRenderer: props.messageOptions.promptComponent ? () => null : undefined,
        };
    }

    return result as AiChatPropsInEvents<AiMsg>;
};
