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
        if (props.personaOptions.assistant) {
            result.personaOptions.assistant = {
                name: props.personaOptions.assistant.name,
                avatar: typeof props.personaOptions.assistant.avatar === 'string'
                    ? props.personaOptions.assistant.avatar
                    : '<REACT ELEMENT />',
                tagline: props.personaOptions.assistant.tagline,
            };
        }

        if (props.personaOptions.user) {
            result.personaOptions.user = {
                name: props.personaOptions.user.name,
                avatar: typeof props.personaOptions.user.avatar === 'string'
                    ? props.personaOptions.user.avatar
                    : '<REACT ELEMENT />',
            };
        }
    }

    if (props.messageOptions) {
        result.messageOptions = {
            ...props.messageOptions,
            responseRenderer: props.messageOptions.responseRenderer ? () => null : undefined,
            promptRenderer: props.messageOptions.promptRenderer ? () => null : undefined,
        };
    }

    return result as AiChatPropsInEvents<AiMsg>;
};
