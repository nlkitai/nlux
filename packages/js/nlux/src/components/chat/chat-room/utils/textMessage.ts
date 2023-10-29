import {uid} from '../../../../x/uid';
import {CompTextMessage} from '../../text-message/model';

export const textMessage = (
    direction: 'in' | 'out',
    content: string,
    createdAt?: Date,
): CompTextMessage => {
    return new CompTextMessage(uid(), {
        direction,
        initialContent: content,
        format: 'text',
        createdAt: createdAt ?? new Date(),
    });
};

export const inTextMessage = (
    content: string,
    createdAt?: Date,
): CompTextMessage => {
    return textMessage('in', content, createdAt);
};

export const outTextMessage = (
    content: string,
    createdAt?: Date,
): CompTextMessage => {
    return textMessage('out', content, createdAt);
};

export const messageInList = 'message-container-in-list';
