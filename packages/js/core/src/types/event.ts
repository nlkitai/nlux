import {AnyAiMsg} from '../../../../shared/src/types/anyAiMsg';
import {ChatItem} from '../../../../shared/src/types/conversation';
import {ExceptionId} from '../../../../shared/src/types/exceptions';
import {AiChatPropsInEvents} from './aiChat/props';

export type MessageReceivedEventDetails<AiMsg> = {
    uid: string;
};

export type MessageRenderedEventDetails<AiMsg> = {
    uid: string;
    message: AiMsg;
};

export type ErrorEventDetails = {
    errorId: ExceptionId;
    message: string;
};

export type ReadyEventDetails<AiMsg> = {
    aiChatProps: AiChatPropsInEvents<AiMsg>
}

export type PreDestroyEventDetails<AiMsg> = {
    aiChatProps: AiChatPropsInEvents<AiMsg>;
    conversationHistory: Readonly<ChatItem<AiMsg>[]>;
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
 * This does not mean that the message has been rendered yet. You should use the messageRendered
 * event if you want to know when the message has been rendered.
 *
 * @param message The message that was received.
 */
export type MessageReceivedCallback<AiMsg = string> = (event: MessageReceivedEventDetails<AiMsg>) => void;

/**
 * The callback for when a message is fully rendered on the screen.
 *
 * @param message The message that was received.
 */
export type MessageRenderedCallback<AiMsg = string> = (event: MessageRenderedEventDetails<AiMsg>) => void;

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
export type ReadyCallback<AiMsg> = (readyDetails: ReadyEventDetails<AiMsg>) => void;

/**
 * The callback for when the chat component is about to be destroyed.
 * This is called when the chat component is about to be destroyed and unmounted from the DOM.
 *
 * @param preDestroyDetails The details of the pre-destroy event such as the AiChatProps used to initialize the chat
 * component and the conversation history.
 */
export type PreDestroyCallback<AiMsg> = (preDestroyDetails: PreDestroyEventDetails<AiMsg>) => void;

export type EventsMap<AiMsg> = {
    ready: ReadyCallback<AiMsg>;
    preDestroy: PreDestroyCallback<AiMsg>;
    messageSent: MessageSentCallback;
    messageReceived: MessageReceivedCallback<AiMsg>;
    messageRendered: MessageReceivedCallback<AiMsg>;
    error: ErrorCallback;
};

export type EventName = keyof EventsMap<AnyAiMsg>;

export type EventCallback<AiMsg> = EventsMap<AiMsg>[EventName];
