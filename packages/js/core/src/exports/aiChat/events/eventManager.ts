import {CallbackFunction} from '../../../../../../shared/src/types/callbackFunction';
import {EventName, EventsConfig, EventsMap} from '../../../types/event';

export class EventManager<AiMsg> {

    private readonly eventListeners: Map<
        EventName,
        Set<EventsMap<AiMsg>[EventName]>
    > = new Map();

    public emit = <EventToEmit extends EventName>(
        event: EventToEmit,
        ...params: Parameters<EventsMap<AiMsg>[EventToEmit]>
    ) => {
        if (!this.eventListeners.has(event)) {
            return;
        }

        this.eventListeners.get(event)?.forEach((callback: EventsMap<AiMsg>[EventName]) => {
            if (typeof callback !== 'function') {
                return;
            }

            (callback as CallbackFunction)(...params);
        });
    };

    public on = <EventToAdd extends EventName>(
        event: EventToAdd,
        callback: EventsMap<AiMsg>[EventToAdd],
    ) => {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }

        this.eventListeners.get(event)?.add(callback);
    };

    public removeAllEventListeners = (eventName: EventName) => this.eventListeners.delete(eventName);

    public removeAllEventListenersForAllEvent = () => this.eventListeners.clear();

    public removeEventListener = <EventToUpdate extends EventName>(
        event: EventToUpdate,
        callback: EventsMap<AiMsg>[EventToUpdate],
    ) => {
        if (!this.eventListeners.has(event)) {
            return;
        }

        this.eventListeners.get(event)?.delete(callback);
        if (!this.eventListeners.get(event)?.size) {
            this.eventListeners.delete(event);
        }
    };

    public updateEventListeners = (
        events: EventsConfig<AiMsg>,
    ) => {
        //
        // Replace all listeners for events present in the new events object
        // This overwrites any existing listeners for these events! But it will not remove
        // listeners for events that are not present in the `events: EventsMap` object.
        //
        const eventKeys = Object.keys(events) as Array<keyof EventsMap<AiMsg>>;
        for (const eventName of eventKeys) {
            this.eventListeners.set(
                eventName,
                new Set([events[eventName] as EventsMap<AiMsg>[EventName]]),
            );
        }
    };
}
