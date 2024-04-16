import {ExceptionId} from '../../../../shared/src/types/exceptions';
import {HighlighterExtension} from '../exports/aiChat/highlighter/highlighter';
import {ChatAdapter} from './adapters/chat/chatAdapter';
import {StandardChatAdapter} from './adapters/chat/standardChatAdapter';
import {AiChatProps} from './aiChat/props';
import {EventName, EventsMap} from './event';

export type ControllerContextProps<MessageType> = Readonly<{
    instanceId: string;
    exception: (exceptionId: ExceptionId) => void;
    adapter: ChatAdapter<MessageType> | StandardChatAdapter<MessageType>;
    syntaxHighlighter?: HighlighterExtension;
}>;

/**
 * Internal context specific to the controller.
 */
export type ControllerContext<MessageType> = ControllerContextProps<MessageType> & {
    update: (
        props: Partial<ControllerContextProps<MessageType>>,
    ) => void;
    emit: <EventToEmit extends EventName>(
        eventName: EventToEmit,
        ...params: Parameters<EventsMap<MessageType>[EventToEmit]>
    ) => void;
    get aiChatProps(): Readonly<AiChatProps<MessageType>>;
};
