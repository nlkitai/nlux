import {HighlighterExtension} from '../../core/highlighter/highlighter';
import {ConversationOptions} from '../../core/options/conversationOptions';
import {LayoutOptions} from '../../core/options/layoutOptions';
import {PersonaOptions} from '../../core/options/personaOptions';
import {PromptBoxOptions} from '../../core/options/promptBoxOptions';
import {ConversationItem} from '../conversation';
import {EventsMap} from '../event';
import {Adapter} from './adapter';
import {StandardAdapter} from './standardAdapter';

export type AiChatInternalProps = {
    adapter: Adapter | StandardAdapter;
    events?: Partial<EventsMap>;
    themeId?: string;
    className?: string;
    initialConversation?: ConversationItem[];
    promptBoxOptions: PromptBoxOptions;
    conversationOptions: ConversationOptions;
    personaOptions: PersonaOptions;
    layoutOptions: LayoutOptions;
    syntaxHighlighter?: HighlighterExtension;
};

/**
 * These are the props that are exposed to the user of the AiChat component.
 * They can be updated using the `updateProps` method, and they are provided to certain adapter methods
 * as part of the `AdapterExtras` attribute.
 */
export type AiChatProps = Readonly<{
    adapter: Adapter | StandardAdapter;
    events?: Partial<EventsMap>;
    themeId?: string;
    className?: string;
    promptBoxOptions?: Readonly<PromptBoxOptions>;
    conversationOptions?: Readonly<ConversationOptions>;
    personaOptions?: Readonly<PersonaOptions>
    layoutOptions?: Readonly<LayoutOptions>;
    syntaxHighlighter?: HighlighterExtension;
}>;
