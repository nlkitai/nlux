import {ChatAdapter} from '../../../../shared/src/types/adapters/chat/chatAdapter';
import {StandardChatAdapter} from '../../../../shared/src/types/adapters/chat/standardChatAdapter';
import {NLErrorId} from '../../../../shared/src/types/exceptions/errors';
import {HighlighterExtension} from '../exports/aiChat/highlighter/highlighter';
import {AiChatProps} from './aiChat/props';
import {EventName, EventsMap} from './event';

export type ControllerContextProps<AiMsg> = Readonly<{
    instanceId: string;
    exception: (exceptionId: NLErrorId) => void;
    adapter: ChatAdapter<AiMsg> | StandardChatAdapter<AiMsg>;
    syntaxHighlighter?: HighlighterExtension;
    htmlSanitizer?: (html: string) => string;
}>;

/**
 * Internal context specific to the controller.
 */
export type ControllerContext<AiMsg> = ControllerContextProps<AiMsg> & {
    update: (
        props: Partial<ControllerContextProps<AiMsg>>,
    ) => void;
    emit: <EventToEmit extends EventName>(
        eventName: EventToEmit,
        ...params: Parameters<EventsMap<AiMsg>[EventToEmit]>
    ) => void;
    get aiChatProps(): AiChatProps<AiMsg>;
};
