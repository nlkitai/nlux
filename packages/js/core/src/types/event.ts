import {ExceptionId} from '../exceptions/exceptions';

export type ErrorEventDetails = {
    errorId: ExceptionId;
    message: string;
};

export type ErrorCallback = (errorDetails: ErrorEventDetails) => void;

export type MessageReceivedCallback = (message: string) => void;

export type MessageSentCallback = (message: string) => void;

export type EventsMap = {
    error: ErrorCallback;
    messageSent: MessageSentCallback;
    messageReceived: MessageReceivedCallback;
};

export type EventName = keyof EventsMap;
export type EventCallback = EventsMap[EventName];
