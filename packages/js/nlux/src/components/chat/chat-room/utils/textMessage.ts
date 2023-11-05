import {Observable} from '../../../../core/bus/observable';
import {comp} from '../../../../core/comp/comp';
import {NluxContext} from '../../../../types/context';
import {CompTextMessage} from '../../text-message/model';
import type {TextMessageContentLoadingStatus} from '../../text-message/types';
import {CompTextMessageProps} from '../../text-message/types';

export const textMessage = (
    context: NluxContext,
    direction: 'in' | 'out',
    source: string | Promise<string> | Observable<string>,
    createdAt?: Date,
    onMessageStatusUpdated?: (messageId: string, status: TextMessageContentLoadingStatus) => void,
): CompTextMessage => {
    const content: string | undefined = typeof source === 'string' ? source : undefined;
    const contentPromise: Promise<string> | undefined = source instanceof Promise ? source : undefined;
    const contentStream: Observable<string> | undefined = source instanceof Observable ? source : undefined;

    const loadingStatus: TextMessageContentLoadingStatus = (typeof source === 'string')
        ? 'loaded'
        : 'loading';

    return comp(CompTextMessage).withContext(context).withProps<CompTextMessageProps>({
        loadingStatus,
        direction,
        content,
        contentPromise,
        contentStream,
        onMessageStatusUpdated,
        format: 'text',
        createdAt: createdAt ?? new Date(),
    }).create();
};

export const inTextMessage = (
    context: NluxContext,
    content: string,
    createdAt?: Date,
): CompTextMessage => {
    return textMessage(context, 'in', content, createdAt);
};

export const outTextMessage = (
    context: NluxContext,
    content: string,
    createdAt?: Date,
): CompTextMessage => {
    return textMessage(context, 'out', content, createdAt);
};

export const messageInList = 'message-container-in-list';
