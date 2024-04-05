import {HighlighterExtension} from '../../core/aiChat/highlighter/highlighter';
import {ConversationOptions} from '../../core/aiChat/options/conversationOptions';
import {LayoutOptions} from '../../core/aiChat/options/layoutOptions';
import {PersonaOptions} from '../../core/aiChat/options/personaOptions';
import {PromptBoxOptions} from '../../core/aiChat/options/promptBoxOptions';
import {ChatAdapter} from '../adapters/chat/chatAdapter';
import {StandardChatAdapter} from '../adapters/chat/standardChatAdapter';
import {ChatItem} from '../conversation';
import {EventsMap} from '../event';

/**
 * These are the props that are used internally by the AiChat component.
 */
export type AiChatInternalProps = {
    adapter: ChatAdapter | StandardChatAdapter;
    events?: Partial<EventsMap>;
    themeId?: string;
    className?: string;
    initialConversation?: ChatItem[];
    promptBoxOptions: PromptBoxOptions;
    conversationOptions: ConversationOptions;
    personaOptions: PersonaOptions;
    layoutOptions: LayoutOptions;
    syntaxHighlighter?: HighlighterExtension;
};

/**
 * These are the props that are exposed to the user of the AiChat component.
 * They can be updated using the `updateProps` method, and they are provided to certain adapter methods
 * as part of the `ChatAdapterExtras` attribute.
 *
 * It excludes properties that are used for initialization such as `initialConversation`.
 */
export type AiChatProps = Readonly<{
    adapter: ChatAdapter | StandardChatAdapter;
    events?: Partial<EventsMap>;
    themeId?: string;
    className?: string;
    promptBoxOptions?: Readonly<PromptBoxOptions>;
    conversationOptions?: Readonly<ConversationOptions>;
    personaOptions?: Readonly<PersonaOptions>
    layoutOptions?: Readonly<LayoutOptions>;
    syntaxHighlighter?: HighlighterExtension;
}>;
