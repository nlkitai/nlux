import {PersonaOptions} from '@nlux/core';
import {AiChatProps as AiChatCoreProps} from '../../../../js/core/src/types/aiChat/props';
import {AiChatProps} from '../exports/props';

export const reactPropsToCoreProps = <AiMsg>(
    props: AiChatProps<AiMsg>,
): Omit<AiChatCoreProps<AiMsg>, 'adapter' | 'events'> => {

    // All keys except the adapter key
    type KeyType = keyof Omit<AiChatCoreProps<AiMsg>, 'adapter' | 'events'>;
    const keys = Object
        .keys(props)
        .filter((key) => key !== 'adapter' && key !== 'events') as KeyType[];

    // const result with Read/write version of this: Omit<AiChatCoreProps<AiMsg>, 'adapter'>
    const result: Record<KeyType, AiChatCoreProps<AiMsg>[KeyType]> = {} as Record<KeyType, AiChatCoreProps<AiMsg>[KeyType]>;

    for (let i = 0; i < keys.length; i++) {
        const key: KeyType = keys[i];
        if (key === 'personaOptions' || key === 'messageOptions') {
            continue;
        }

        result[key] = props[key];
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

    return result as Omit<AiChatCoreProps<AiMsg>, 'adapter' | 'events'>;
};
