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

/**
 * The callback for when an error event is emitted.
 *
 * @param errorDetails The details of the error event such as the error message and the error id.
 */
export type ErrorCallback = (errorDetails: ErrorEventDetails) => void;

/**
 * The callback for when a message is received.
 * This is called when the chat component receives the full response from the adapter.
 *
 * @param message The message that was received.
 */
export type MessageReceivedCallback = (message: string) => void;

/**
 * The callback for when a message is sent.
 * This is called when the chat component sends the message to the adapter.
 *
 * @param message The message that was sent.
 */
export type MessageSentCallback = (message: string) => void;

/**
 * The callback for when the chat component is ready.
 * This is called when the chat component is fully initialized and ready to be used.
 *
 * @param readyDetails The details of the ready event such as the AiChatProps used to initialize the chat component.
 */
export type ReadyCallback = (readyDetails: ReadyEventDetails) => void;

/**
 * The callback for when the chat component is about to be destroyed.
 * This is called when the chat component is about to be destroyed and unmounted from the DOM.
 *
 * @param preDestroyDetails The details of the pre-destroy event such as the AiChatProps used to initialize the chat
 * component and the conversation history.
 */
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
