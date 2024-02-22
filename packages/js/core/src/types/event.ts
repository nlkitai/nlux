import {ExceptionId} from '../exceptions/exceptions';
import {AiChatProps} from './aiChat/props';
import {ConversationItem} from './conversation';

export type ErrorEventDetails = {
    errorId: ExceptionId;
    message: string;
};

export type ReadyEventDetails = {
    aiChatProps: AiChatProps;
}

export type PreDestroyEventDetails = {
    aiChatProps: AiChatProps;
    conversationHistory: Readonly<ConversationItem[]>;
}

export type ErrorCallback = (errorDetails: ErrorEventDetails) => void;
export type MessageReceivedCallback = (message: string) => void;
export type MessageSentCallback = (message: string) => void;
export type ReadyCallback = (readyDetails: ReadyEventDetails) => void;
export type PreDestroyCallback = (preDestroyDetails: PreDestroyEventDetails) => void;

export type EventsMap = {
    ready: ReadyCallback;
    preDestroy: PreDestroyCallback;
    messageSent: MessageSentCallback;
    messageReceived: MessageReceivedCallback;
    error: ErrorCallback;
};

export type EventName = keyof EventsMap;
export type EventCallback = EventsMap[EventName];
