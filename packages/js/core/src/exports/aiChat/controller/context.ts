import {AiChatProps} from '../../../types/aiChat/props';
import {ControllerContext, ControllerContextProps} from '../../../types/controllerContext';
import {EventName, EventsMap} from '../../../types/event';

export const createControllerContext = (
    props: ControllerContextProps,
    getAiChatProps: () => Readonly<AiChatProps>,
    emitEvent: <EventToEmit extends EventName>(
        event: EventToEmit,
        ...params: Parameters<EventsMap[EventToEmit]>
    ) => void,
): ControllerContext => {
    const context: ControllerContext = {
        ...props,
        update: (newProps: Partial<ControllerContextProps>) => {
            Object.assign(context, newProps);
        },
        emit: <EventToEmit extends EventName>(
            eventName: EventToEmit,
            ...params: Parameters<EventsMap[EventToEmit]>
        ) => {
            emitEvent(eventName, ...params);
        },
        get aiChatProps() {
            return getAiChatProps();
        },
    };

    return context;
};
