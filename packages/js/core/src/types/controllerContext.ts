import {ChatAdapter} from '@shared/types/adapters/chat/chatAdapter';
import {StandardChatAdapter} from '@shared/types/adapters/chat/standardChatAdapter';
import {NLErrorId} from '@shared/types/exceptions/errors';
import {HighlighterExtension} from '../aiChat/highlighter/highlighter';
import {SanitizerExtension} from '@shared/sanitizer/sanitizer';
import {AiChatProps} from './aiChat/props';
import {EventName, EventsMap} from './event';

export type ControllerContextProps<AiMsg> = Readonly<{
    instanceId: string;
    exception: (exceptionId: NLErrorId) => void;
    adapter: ChatAdapter<AiMsg> | StandardChatAdapter<AiMsg>;
    syntaxHighlighter?: HighlighterExtension;
    htmlSanitizer?: SanitizerExtension;
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
