import {ConversationMessage} from '@nlux-dev/react/src/comp/Conversation/props';
import {ConversationPart} from '../../types/conversationPart';

export const conversationPartsToMessages = <MessageType>(
    parts: ConversationPart<MessageType>[],
): ConversationMessage<MessageType>[] => {
    const result: ConversationMessage<MessageType>[] = [];
    for (const conversationPart of parts) {
        if (conversationPart.status === 'error') {
            continue;
        }

        conversationPart.messages.forEach((partMessage) => {
            if (partMessage.participantRole === 'user') {
                result.push({
                    id: partMessage.uid,
                    role: 'user',
                    message: partMessage.content,
                });
            } else {
                if (partMessage.content !== undefined) {
                    result.push({
                        id: partMessage.uid,
                        role: 'ai',
                        message: partMessage.content,
                    });
                }
            }
        });
    }

    return result;
};
