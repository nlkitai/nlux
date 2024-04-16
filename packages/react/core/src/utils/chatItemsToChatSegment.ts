import {ChatItem} from '@nlux/core';
import {ChatSegment, ChatSegmentItem} from '../../../../shared/src/types/chatSegment/chatSegment';
import {ChatSegmentAiMessage} from '../../../../shared/src/types/chatSegment/chatSegmentAiMessage';
import {ChatSegmentUserMessage} from '../../../../shared/src/types/chatSegment/chatSegmentUserMessage';
import {uid} from '../../../../shared/src/utils/uid';
import {warn} from '../../../../shared/src/utils/warn';

export const chatItemsToChatSegment = <MessageType>(
    chatItems: ChatItem<MessageType>[],
): ChatSegment<MessageType> => {
    const segmentItems: ChatSegmentItem<MessageType>[] = chatItems.map((message, index) => {
        if (message.role !== 'ai' && message.role !== 'user') {
            warn(
                `Invalid role for item at index ${index} in initial conversation: ` +
                `Role must be "ai" or "user"`,
            );

            return;
        }

        if (message.role === 'user') {
            if (typeof message.message !== 'string') {
                warn(
                    `Invalid message type for item at index ${index} in initial conversation: ` +
                    `When role is "user", message must be a string`,
                );

                return;
            }

            return {
                uid: uid(),
                time: new Date(),
                status: 'complete',
                participantRole: 'user',
                content: message.message,
            } satisfies ChatSegmentUserMessage;
        }

        return {
            uid: uid(),
            time: new Date(),
            status: 'complete',
            participantRole: 'ai',
            content: message.message,
            dataTransferMode: 'fetch',
        } satisfies ChatSegmentAiMessage<MessageType>;
    }).filter(
        (segmentItem: ChatSegmentItem<MessageType> | undefined): segmentItem is ChatSegmentItem<MessageType> => {
            return segmentItem !== undefined;
        },
    ) as ChatSegmentItem<MessageType>[];

    return {
        uid: 'initial',
        status: 'complete',
        items: segmentItems,
    } satisfies ChatSegment<MessageType>;
};
