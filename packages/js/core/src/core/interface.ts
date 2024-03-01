import {ChatAdapterBuilder} from '../types/aiChat/chatAdapterBuilder';
import {AiChatProps} from '../types/aiChat/props';
import {ConversationItem} from '../types/conversation';
import {EventCallback, EventName, EventsMap} from '../types/event';
import {HighlighterExtension} from './aiChat/highlighter/highlighter';
import {ConversationOptions} from './aiChat/options/conversationOptions';
import {LayoutOptions} from './aiChat/options/layoutOptions';
import {PersonaOptions} from './aiChat/options/personaOptions';
import {PromptBoxOptions} from './aiChat/options/promptBoxOptions';

export interface IAiChat {
    hide(): void;
    mount(rootElement: HTMLElement): void;
    get mounted(): boolean;

    on(event: EventName, callback: EventsMap[EventName]): IAiChat;
    removeAllEventListeners(event?: EventName): void;
    removeEventListener(event: EventName, callback: EventCallback): void;

    show(): void;
    unmount(): void;
    updateProps(props: Partial<AiChatProps>): void;

    withAdapter(adapterBuilder: ChatAdapterBuilder): IAiChat;
    withClassName(className: string): IAiChat;
    withConversationOptions(conversationOptions: ConversationOptions): IAiChat;
    withInitialConversation(initialConversation: ConversationItem[]): IAiChat;
    withLayoutOptions(layoutOptions: LayoutOptions): IAiChat;
    withPersonaOptions(personaOptions: PersonaOptions): IAiChat;
    withPromptBoxOptions(promptBoxOptions: PromptBoxOptions): IAiChat;
    withSyntaxHighlighter(syntaxHighlighter: HighlighterExtension): IAiChat;
    withTheme(themeId: string): IAiChat;
}
