import {MessageDirection, ParticipantRole} from '@nlux/core';

export const roleToDirection = (role: ParticipantRole): MessageDirection => {
    switch (role) {
        case 'user':
            return 'outgoing';
    }

    return 'incoming';
};
