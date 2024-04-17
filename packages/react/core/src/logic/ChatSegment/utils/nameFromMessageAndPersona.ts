import {ParticipantRole} from '@nlux/core';
import {AnyAiMsg} from '../../../../../../shared/src/types/anyAiMsg';
import {ConversationCompProps} from '../../Conversation/props';

export const nameFromMessageAndPersona = (role: ParticipantRole, personaOptions: ConversationCompProps<AnyAiMsg>['personaOptions']) => {
    if (role === 'ai') {
        return personaOptions?.bot?.name;
    }

    if (role === 'user') {
        return personaOptions?.user?.name;
    }

    return undefined;
};
