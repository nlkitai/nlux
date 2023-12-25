import {PersonaOptions} from '@nlux/core';
import {PersonaOptions as ReactPersonaOptions} from '@nlux/react';
import {reactPersonasToCorePersonas} from './reactPersonasToCorePersonas';

export const personaOptionsUpdater = async (
    currentOptions: ReactPersonaOptions | undefined,
    newOptions: ReactPersonaOptions | undefined,
): Promise<Partial<PersonaOptions> | undefined> => {
    const result: Partial<PersonaOptions> = {};
    if (currentOptions === undefined && newOptions === undefined) {
        //
        // Nothing to update.
        //
        return undefined;
    }

    if (currentOptions?.bot !== newOptions?.bot) {
        if (newOptions?.bot === undefined) {
            result.bot = undefined;
        } else {
            result.bot = (await reactPersonasToCorePersonas({
                bot: newOptions.bot,
            })).bot;
        }
    }

    if (currentOptions?.user !== newOptions?.user) {
        if (newOptions?.user === undefined) {
            result.user = undefined;
        } else {
            result.user = (await reactPersonasToCorePersonas({
                user: newOptions.user,
            })).user;
        }
    }

    if (Object.keys(result).length === 0) {
        //
        // Nothing to update.
        //
        return undefined;
    }

    return result;
};
