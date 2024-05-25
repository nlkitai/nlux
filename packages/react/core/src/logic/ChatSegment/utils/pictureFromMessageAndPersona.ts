import {ParticipantRole} from '@nlux/core';
import {AnyAiMsg} from '../../../../../../shared/src/types/anyAiMsg';
import {ConversationCompProps} from '../../Conversation/props';

export const pictureFromMessageAndPersona = (role: ParticipantRole, personaOptions: ConversationCompProps<AnyAiMsg>['personaOptions']) => {
    if (role === 'assistant') {
        return personaOptions?.assistant?.picture;
    }

    if (role === 'user') {
        return personaOptions?.user?.picture;
    }

    return undefined;
};
