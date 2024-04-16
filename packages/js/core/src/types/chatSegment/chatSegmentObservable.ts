import {ChatSegmentEvent, ChatSegmentEventsMap} from './chatSegment';

/**
 * An interface for listening to events related to a chat segment.
 * When a new chat segment is created and still active, the observable can be used to listen to events.
 *
 * It's typically created by the module responsible for submitting a prompt or the module responsible for
 * communicating with the AI.
 */
export type ChatSegmentObservable<MessageType> = {
    /**
     * The ID of the chat segment that the observable is listening to.
     */
    get segmentId(): string;
    /**
     * Enables listening to events related to the chat segment.
     *
     * @param {EventType} event
     * @param {ChatSegmentEventsMap<MessageType>[EventType]} callback
     */
    on: <EventType extends ChatSegmentEvent>(
        event: EventType,
        callback: ChatSegmentEventsMap<MessageType>[EventType],
    ) => void;
    /**
     * Removes a listener from the chat segment.
     *
     * @param {EventType} event
     * @param {ChatSegmentEventsMap<MessageType>[EventType]} callback
     */
    removeListener: <EventType extends ChatSegmentEvent>(
        event: EventType,
        callback: ChatSegmentEventsMap<MessageType>[EventType],
    ) => void;
    /**
     * Destroys the observer and removes all listeners.
     * After calling this function, the observer should not be used anymore.
     */
    destroy: () => void;
};
