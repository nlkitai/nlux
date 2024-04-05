import {ConversationMessage} from '@nlux-dev/react/src/comp/Conversation/props';
import {ChatSegment} from '../../types/chatSegment';
import {getMessageStatusFromPart} from './getMessageStatusFromPart';

export const chatSegmentsToMessages = <MessageType>(
    parts: ChatSegment<MessageType>[],
): ConversationMessage<MessageType>[] => {
    const result: ConversationMessage<MessageType>[] = [];
    for (const chatSegment of parts) {
        if (chatSegment.status === 'error') {
            continue;
        }

        chatSegment.messages.forEach((partMessage) => {
            if (partMessage.participantRole === 'user') {
                result.push({
                    id: partMessage.uid,
                    message: partMessage.content,
                    role: 'user',
                    status: 'rendered',
                });
            } else {
                const status = getMessageStatusFromPart(chatSegment, partMessage);
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
