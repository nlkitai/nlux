import {HighlighterExtension} from '../core/highlighter/highlighter';
import {ExceptionId} from '../exceptions/exceptions';
import {Adapter} from './aiChat/adapter';
import {AiChatProps} from './aiChat/props';
import {StandardAdapter} from './aiChat/standardAdapter';
import {EventName, EventsMap} from './event';

export type ControllerContextProps = Readonly<{
    instanceId: string;
    exception: (exceptionId: ExceptionId) => void;
    adapter: Adapter | StandardAdapter;
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
