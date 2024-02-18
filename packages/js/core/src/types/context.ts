import {HighlighterExtension} from '../core/highlighter/highlighter';
import {ExceptionId} from '../exceptions/exceptions';
import {Adapter} from './adapter';
import {EventName, EventsMap} from './event';
import {AiChatProps} from './props';
import {StandardAdapter} from './standardAdapter';

export type ContextProps = Readonly<{
    instanceId: string;
    exception: (exceptionId: ExceptionId) => void;
    adapter: Adapter | StandardAdapter;
    syntaxHighlighter?: HighlighterExtension;
}>;

export type NluxContext = ContextProps & {
    update: (props: Partial<ContextProps>) => void;
    emit: <EventToEmit extends EventName>(eventName: EventToEmit, ...params: Parameters<EventsMap[EventToEmit]>) => void;
    get aiChatProps(): Readonly<AiChatProps>;
};
