import {HighlighterExtension} from '../core/aiChat/highlighter/highlighter';
import {ExceptionId} from '../exceptions/exceptions';
import {ChatAdapter} from './aiChat/chatAdapter';
import {AiChatProps} from './aiChat/props';
import {StandardChatAdapter} from './aiChat/standardChatAdapter';
import {EventName, EventsMap} from './event';

export type ControllerContextProps = Readonly<{
    instanceId: string;
    exception: (exceptionId: ExceptionId) => void;
    adapter: ChatAdapter | StandardChatAdapter;
    syntaxHighlighter?: HighlighterExtension;
}>;

/**
 * Internal context specific to the controller.
 */
export type ControllerContext = ControllerContextProps & {
    update: (props: Partial<ControllerContextProps>) => void;
    emit: <EventToEmit extends EventName>(eventName: EventToEmit, ...params: Parameters<EventsMap[EventToEmit]>) => void;
    get aiChatProps(): Readonly<AiChatProps>;
};
