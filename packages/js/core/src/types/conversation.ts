import {ParticipantRole} from './participant';

export type ConversationItem<MessageType = string> = {
    role: ParticipantRole;
    message: MessageType;
}
