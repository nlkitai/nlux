import {BotPersona, UserPersona} from '@nlux/core';
import {comp} from '../../../../core/comp/comp';
import {NluxContext} from '../../../../types/context';
import {CompMessage} from '../../message/message.model';
import {CommonMessageProps, CompMessageProps, MessageContentType} from '../../message/message.types';

export const textMessage = (
    context: NluxContext,
    direction: 'in' | 'out',
    trackResizeAndDomChange: boolean,
    contentType: MessageContentType,
    content?: string,
    createdAt?: Date,
    botPersona?: BotPersona,
    userPersona?: UserPersona,
): CompMessage => {
    const defaultContentStatus = contentType === 'stream' ? 'connecting' :
        contentType === 'promise' ? 'loading' : 'loaded';

    const commonProps: CommonMessageProps = {
        format: 'text',
        loadingStatus: defaultContentStatus,
        contentType,
        content,
        createdAt: createdAt ?? new Date(),
        trackResize: trackResizeAndDomChange,
        trackDomChange: trackResizeAndDomChange,
    };

    const props: CompMessageProps = direction === 'in' ? {
        ...commonProps,
        direction,
        botPersona: botPersona,
    } : {
        ...commonProps,
        direction,
        userPersona: userPersona,
    };

    return comp(CompMessage).withContext(context).withProps<CompMessageProps>(props).create();
};

export const messageInList = 'message-container-in-list';
