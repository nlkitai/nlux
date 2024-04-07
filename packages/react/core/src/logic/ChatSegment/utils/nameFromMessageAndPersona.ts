import {ParticipantRole} from '@nlux/core';
import {ConversationCompProps} from '../../Conversation/props';

export const nameFromMessageAndPersona = (role: ParticipantRole, personaOptions: ConversationCompProps<unknown>['personaOptions']) => {
    if (role === 'ai') {
        return personaOptions?.bot?.name;
    }

    if (role === 'user') {
        return personaOptions?.user?.name;
    }

    return undefined;
};
