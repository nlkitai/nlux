import {AiChatProps} from '../../../types/aiChat/props';
import {ControllerContext, ControllerContextProps} from '../../../types/controllerContext';
import {EventName, EventsMap} from '../../../types/event';

export const createControllerContext = <MessageType>(
    props: ControllerContextProps<MessageType>,
    getAiChatProps: () => Readonly<AiChatProps<MessageType>>,
    emitEvent: <EventToEmit extends EventName>(
        event: EventToEmit,
        ...params: Parameters<EventsMap<MessageType>[EventToEmit]>
    ) => void,
): ControllerContext<MessageType> => {
    const context: ControllerContext<MessageType> = {
        ...props,
        update: (newProps: Partial<ControllerContextProps<MessageType>>) => {
            Object.assign(context, newProps);
        },
        emit: <EventToEmit extends EventName>(
            eventName: EventToEmit,
            ...params: Parameters<EventsMap<MessageType>[EventToEmit]>
        ) => {
            emitEvent(eventName, ...params);
        },
        get aiChatProps() {
            return getAiChatProps();
        },
    };

    return context;
};
