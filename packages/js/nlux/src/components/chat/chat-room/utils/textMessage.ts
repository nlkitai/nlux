import {Observable} from '../../../../core/bus/observable.ts';
import {uid} from '../../../../x/uid';
import {CompTextMessage} from '../../text-message/model';
import type {TextMessageContentLoadingStatus} from '../../text-message/types.ts';

export const textMessage = (
    direction: 'in' | 'out',
    source: string | Promise<string> | Observable<string>,
    createdAt?: Date,
    onMessageStatusUpdated?: (messageId: string, status: TextMessageContentLoadingStatus) => void,
): CompTextMessage => {
    const content: string | undefined = typeof source === 'string' ? source : undefined;
    const contentPromise: Promise<string> | undefined = source instanceof Promise ? source : undefined;
    const contentStream: Observable<string> | undefined = source instanceof Observable ? source : undefined;

    return new CompTextMessage(uid(), {
        direction,
        content,
        contentPromise,
        contentStream,
        onMessageStatusUpdated,
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
