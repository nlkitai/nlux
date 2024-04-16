import {comp} from '../../../../exports/aiChat/comp/comp';
import {BotPersona, UserPersona} from '../../../../exports/aiChat/options/personaOptions';
import {ControllerContext} from '../../../../types/controllerContext';
import {CompMessage} from '../../message/message.model';
import {CommonMessageProps, CompMessageProps, MessageContentType} from '../../message/message.types';

export const textMessage = <AiMsg>(
    context: ControllerContext<AiMsg>,
    direction: 'in' | 'out',
    trackResizeAndDomChange: boolean,
    streamingAnimationSpeed: number,
    contentType: MessageContentType,
    content?: AiMsg | string,
    createdAt?: Date,
    botPersona?: BotPersona,
    userPersona?: UserPersona,
): CompMessage<AiMsg> => {
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

    const props: CompMessageProps<AiMsg> = direction === 'in' ? {
        ...commonProps,
        direction,
        botPersona: botPersona,
        content: content as AiMsg,
    } : {
        ...commonProps,
        direction,
        userPersona: userPersona,
        content: content as string,
    };

    return comp(CompMessage<AiMsg>)
        .withContext(context)
        .withProps<CompMessageProps<AiMsg>>(props)
        .create();
};

export const messageInList = 'message-container-in-list';
