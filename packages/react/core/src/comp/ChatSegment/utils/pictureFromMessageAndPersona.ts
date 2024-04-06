import {ParticipantRole} from '@nlux/core';
import {ConversationCompProps} from '../../Conversation/props';

export const pictureFromMessageAndPersona = (role: ParticipantRole, personaOptions: ConversationCompProps<unknown>['personaOptions']) => {
    if (role === 'ai') {
        return personaOptions?.bot?.picture;
    }

    if (role === 'user') {
        return personaOptions?.user?.picture;
    }

    return undefined;
};
