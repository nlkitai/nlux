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
 */
export type AiChatProps<AiMsg = string> = {
    adapter: ChatAdapter<AiMsg> | StandardChatAdapter<AiMsg>;
    events?: Partial<EventsMap<AiMsg>>;
    initialConversation?: ChatItem<AiMsg>[];
    themeId?: string;
    className?: string;
    promptBoxOptions?: PromptBoxOptions;
    conversationOptions?: ConversationOptions;
    messageOptions?: MessageOptions<AiMsg>;
    personaOptions?: PersonaOptions;
    layoutOptions?: LayoutOptions;
};

/**
 * When sending props to event callbacks, we exclude the adapter and events properties.
 * This is because they are not serializable and because the events are already being called.
 */
export type AiChatPropsInEvents<AiMsg> = Omit<AiChatProps<AiMsg>, 'adapter' | 'events'>;

/**
 * This type represents the props that can be updated on the AiChat component, after it has been initialized.
 * It excludes the initialConversation property because it's only used during initialization and cannot be updated.
 */
export type UpdatableAiChatProps<AiMsg> = Partial<
    Omit<AiChatProps<AiMsg>, 'initialConversation'>
>;
