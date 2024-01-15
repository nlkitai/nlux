import {ContextProps, NluxContext} from '../types/context';
import {EventName, EventsMap} from '../types/event';

export const createContext = (
    props: ContextProps,
    emitEvent: <EventToEmit extends EventName>(
        event: EventToEmit,
        ...params: Parameters<EventsMap[EventToEmit]>
    ) => void,
): NluxContext => {
    const context: NluxContext = {
        ...props,
        update: (newProps: Partial<ContextProps>) => {
            Object.assign(context, newProps);
        },
        emit: <EventToEmit extends EventName>(
            eventName: EventToEmit,
            ...params: Parameters<EventsMap[EventToEmit]>
        ) => {
            emitEvent(eventName, ...params);
        },
    };

    return context;
};
