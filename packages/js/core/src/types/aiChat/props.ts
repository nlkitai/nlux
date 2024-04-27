import {ChatAdapter} from '../../../../../shared/src/types/adapters/chat/chatAdapter';
import {StandardChatAdapter} from '../../../../../shared/src/types/adapters/chat/standardChatAdapter';
import {ChatItem} from '../../../../../shared/src/types/conversation';
import {ConversationOptions} from '../../exports/aiChat/options/conversationOptions';
import {LayoutOptions} from '../../exports/aiChat/options/layoutOptions';
import {MessageOptions} from '../../exports/aiChat/options/messageOptions';
import {PersonaOptions} from '../../exports/aiChat/options/personaOptions';
import {PromptBoxOptions} from '../../exports/aiChat/options/promptBoxOptions';
import {EventsMap} from '../event';

/**
 * These are the props that are used internally by the AiChat component.
 */
export type AiChatInternalProps<AiMsg> = {
    adapter: ChatAdapter<AiMsg> | StandardChatAdapter<AiMsg>;
    events?: Partial<EventsMap<AiMsg>>;
    themeId?: string;
    className?: string;
    initialConversation?: ChatItem<AiMsg>[];
    promptBoxOptions: PromptBoxOptions;
    conversationOptions: ConversationOptions;
    messageOptions: MessageOptions<AiMsg>;
    personaOptions: PersonaOptions;
    layoutOptions: LayoutOptions;
};

/**
 * These are the props that are exposed to the user of the AiChat component.
 * They can be updated using the `updateProps` method, and they are provided to certain adapter methods
 * as part of the `ChatAdapterExtras` attribute.
 *
 * It excludes properties that are used for initialization such as `initialConversation`.
 */
export type AiChatProps<AiMsg = string> = Readonly<{
    adapter: ChatAdapter<AiMsg> | StandardChatAdapter<AiMsg>;
    events?: Partial<EventsMap<AiMsg>>;
    themeId?: string;
    className?: string;
    layoutOptions?: LayoutOptions;
    promptBoxOptions?: PromptBoxOptions;
    personaOptions?: PersonaOptions;
    conversationOptions?: ConversationOptions;
    messageOptions?: MessageOptions<AiMsg>;
}>;
