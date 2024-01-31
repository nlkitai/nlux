import {ParticipantRole} from './participant';

export type ConversationItem = {
    role: ParticipantRole;
    message: string;
}
