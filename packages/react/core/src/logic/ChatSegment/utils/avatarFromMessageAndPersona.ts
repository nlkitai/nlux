import {ParticipantRole} from '@nlux/core';
import {PersonaOptions} from '../../../exports/personaOptions';

export const avatarFromMessageAndPersona = (
    role: ParticipantRole, personaOptions: PersonaOptions
) => {
    if (role === 'assistant') {
        return personaOptions?.assistant?.avatar;
    }

    if (role === 'user') {
        return personaOptions?.user?.avatar;
    }

    return undefined;
};
