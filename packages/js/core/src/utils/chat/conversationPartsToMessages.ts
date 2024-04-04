import {ConversationMessage} from '@nlux-dev/react/src/comp/Conversation/props';
import {ConversationPart} from '../../types/conversationPart';
import {getMessageStatusFromPart} from './getMessageStatusFromPart';

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
                    message: partMessage.content,
                    role: 'user',
                    status: 'rendered',
                });
            } else {
                const status = getMessageStatusFromPart(conversationPart, partMessage);
                if (status === 'rendered') {
                    result.push({
                        id: partMessage.uid,
                        message: partMessage.content!,
                        role: 'ai',
                        status: 'rendered',
                    });
                } else {
                    result.push({
                        id: partMessage.uid,
                        message: undefined,
                        role: 'ai',
                        status,
                    });
                }
            }
        });
    }

    return result;
};
