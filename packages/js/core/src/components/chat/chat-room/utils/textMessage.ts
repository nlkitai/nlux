import {comp} from '../../../../core/comp/comp';
import {NluxContext} from '../../../../types/context';
import {CompMessage} from '../../message/message.model';
import {CompMessageProps, MessageContentType} from '../../message/message.types';

export const textMessage = (
    context: NluxContext,
    direction: 'in' | 'out',
    trackResizeAndDomChange: boolean,
    contentType: MessageContentType,
    content?: string,
    createdAt?: Date,
): CompMessage => {
    const defaultContentStatus = contentType === 'stream' ? 'connecting' :
        contentType === 'promise' ? 'loading' : 'loaded';
    return comp(CompMessage).withContext(context).withProps<CompMessageProps>({
        format: 'text',
        loadingStatus: defaultContentStatus,
        direction,
        contentType,
        content,
        createdAt: createdAt ?? new Date(),
        trackResize: trackResizeAndDomChange,
        trackDomChange: trackResizeAndDomChange,
    }).create();
};

export const messageInList = 'message-container-in-list';
