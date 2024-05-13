import {AiChatProps} from '../../../types/aiChat/props';
import {ControllerContext, ControllerContextProps} from '../../../types/controllerContext';
import {EventName, EventsMap} from '../../../types/event';

export const createControllerContext = <AiMsg>(
    props: ControllerContextProps<AiMsg>,
    getAiChatProps: () => AiChatProps<AiMsg>,
    emitEvent: <EventToEmit extends EventName>(
        event: EventToEmit,
        ...params: Parameters<EventsMap<AiMsg>[EventToEmit]>
    ) => void,
): ControllerContext<AiMsg> => {
    const context: ControllerContext<AiMsg> = {
        ...props,
        update: (newProps: Partial<ControllerContextProps<AiMsg>>) => {
            Object.assign(context, newProps);
        },
        emit: <EventToEmit extends EventName>(
            eventName: EventToEmit,
            ...params: Parameters<EventsMap<AiMsg>[EventToEmit]>
        ) => {
            emitEvent(eventName, ...params);
        },
        get aiChatProps() {
            return getAiChatProps();
        },
    };

    return context;
};
