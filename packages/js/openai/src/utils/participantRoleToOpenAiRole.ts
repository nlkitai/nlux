import {ParticipantRole} from '@nlux/core';

export const participantRoleToOpenAiRole = (participantRole: ParticipantRole): 'system' | 'user' | 'assistant' => {
    switch (participantRole) {
        case 'system':
            return 'system';
        case 'user':
            return 'user';
        case 'ai':
            return 'assistant';
        default:
            return 'user';
    }
};
