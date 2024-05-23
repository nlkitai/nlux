import {ChatAdapter} from '../../../../../shared/src/types/adapters/chat/chatAdapter';
import {StandardChatAdapter} from '../../../../../shared/src/types/adapters/chat/standardChatAdapter';
import {ChatItem} from '../../../../../shared/src/types/conversation';
import {ConversationOptions} from '../../exports/aiChat/options/conversationOptions';
import {DisplayOptions} from '../../exports/aiChat/options/displayOptions';
import {MessageOptions} from '../../exports/aiChat/options/messageOptions';
import {PersonaOptions} from '../../exports/aiChat/options/personaOptions';
import {ComposerOptions} from '../../exports/aiChat/options/composerOptions';
import {EventsConfig} from '../event';

/**
 * These are the props that are used internally by the AiChat component.
 */
export type AiChatInternalProps<AiMsg> = {
    adapter: ChatAdapter<AiMsg> | StandardChatAdapter<AiMsg>;
    className?: string;
    events?: EventsConfig<AiMsg>;
    initialConversation?: ChatItem<AiMsg>[];
    displayOptions: DisplayOptions;
    personaOptions: PersonaOptions;
    composerOptions: ComposerOptions;
    conversationOptions: ConversationOptions;
    messageOptions: MessageOptions<AiMsg>;
};

/**
 * These are the props that are exposed to the user of the AiChat component.
 */
export type AiChatProps<AiMsg = string> = {
    adapter: ChatAdapter<AiMsg> | StandardChatAdapter<AiMsg>;
    className?: string;
    events?: EventsConfig<AiMsg>;
    initialConversation?: ChatItem<AiMsg>[];
    composerOptions?: ComposerOptions;
    conversationOptions?: ConversationOptions;
    messageOptions?: MessageOptions<AiMsg>;
    personaOptions?: PersonaOptions;
    displayOptions?: DisplayOptions;
};

/**
 * When sending props to event callbacks, we exclude the adapter and events properties.
 * This is because they are not serializable and because the events are already being called.
 */
export type AiChatPropsInEvents<AiMsg = string> = Omit<AiChatProps<AiMsg>, 'adapter' | 'events'>;

/**
 * This type represents the props that can be updated on the AiChat component, after it has been initialized.
 * It excludes the initialConversation property because it's only used during initialization and cannot be updated.
 */
export type UpdatableAiChatProps<AiMsg> = Partial<
    Omit<AiChatProps<AiMsg>, 'initialConversation'>
>;
