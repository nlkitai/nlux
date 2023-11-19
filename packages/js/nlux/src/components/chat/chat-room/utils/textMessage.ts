import {comp} from '../../../../core/comp/comp';
import {NluxContext} from '../../../../types/context';
import {CompMessage} from '../../message/message.model';
import {CompMessageProps, MessageContentType} from '../../message/message.types';

export const textMessage = (
    context: NluxContext,
    direction: 'in' | 'out',
    contentType: MessageContentType,
    content?: string,
    createdAt?: Date,
): CompMessage => {
    return comp(CompMessage).withContext(context).withProps<CompMessageProps>({
        format: 'text',
        direction,
        contentType,
        content,
        createdAt: createdAt ?? new Date(),
    }).create();
};

export const messageInList = 'message-container-in-list';
