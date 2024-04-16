import {EventName, EventsMap} from '../../../types/event';

export class EventManager<MessageType> {

    public emit = <EventToEmit extends EventName>(
        event: EventToEmit,
        ...params: Parameters<EventsMap<MessageType>[EventToEmit]>
    ) => {
        if (!this.eventListeners.has(event)) {
            return;
        }

        this.eventListeners.get(event)?.forEach((callback: EventsMap<MessageType>[EventName]) => {
            if (typeof callback !== 'function') {
                return;
            }

            (callback as Function)(...params);
        });
    };

    public on = <EventToAdd extends EventName>(
        event: EventToAdd,
        callback: EventsMap<MessageType>[EventToAdd],
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
        callback: EventsMap<MessageType>[EventToUpdate],
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
        events: Partial<EventsMap<MessageType>>,
    ) => {
        //
        // Replace all listeners for events present in the new events object
        // This overwrites any existing listeners for these events! But it will not remove
        // listeners for events that are not present in the `events: Partial<EventsMap>` object.
        //
        const eventKeys = Object.keys(events) as Array<keyof EventsMap<MessageType>>;
        for (const eventName of eventKeys) {
            this.eventListeners.set(
                eventName,
                new Set([events[eventName] as EventsMap<MessageType>[EventName]]),
            );
        }
    };

    private readonly eventListeners: Map<
        EventName,
        Set<EventsMap<MessageType>[EventName]>
    > = new Map();
}
