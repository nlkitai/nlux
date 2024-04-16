import {comp} from '../../../../exports/aiChat/comp/comp';
import {BotPersona, UserPersona} from '../../../../exports/aiChat/options/personaOptions';
import {ControllerContext} from '../../../../types/controllerContext';
import {CompMessage} from '../../message/message.model';
import {CommonMessageProps, CompMessageProps, MessageContentType} from '../../message/message.types';

export const textMessage = <MessageType>(
    context: ControllerContext<MessageType>,
    direction: 'in' | 'out',
    trackResizeAndDomChange: boolean,
    streamingAnimationSpeed: number,
    contentType: MessageContentType,
    content?: MessageType | string,
    createdAt?: Date,
    botPersona?: BotPersona,
    userPersona?: UserPersona,
): CompMessage<MessageType> => {
    const defaultContentStatus = contentType === 'stream' ? 'connecting' :
        contentType === 'promise' ? 'loading' : 'loaded';

    const commonProps: CommonMessageProps = {
        format: 'text',
        loadingStatus: defaultContentStatus,
        streamingAnimationSpeed,
        contentType,
        createdAt: createdAt ?? new Date(),
        trackResize: trackResizeAndDomChange,
        trackDomChange: trackResizeAndDomChange,
    };

    const props: CompMessageProps<MessageType> = direction === 'in' ? {
        ...commonProps,
        direction,
        botPersona: botPersona,
        content: content as MessageType,
    } : {
        ...commonProps,
        direction,
        userPersona: userPersona,
        content: content as string,
    };

    return comp(CompMessage<MessageType>)
        .withContext(context)
        .withProps<CompMessageProps<MessageType>>(props)
        .create();
};

export const messageInList = 'message-container-in-list';
