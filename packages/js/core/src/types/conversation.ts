import {ParticipantRole} from './participant';

export type ChatItem<MessageType = string> = {
    role: ParticipantRole;
    message: MessageType;
}
