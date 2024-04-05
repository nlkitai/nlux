import {HighlighterExtension} from '../../core/aiChat/highlighter/highlighter';
import {ConversationOptions} from '../../core/aiChat/options/conversationOptions';
import {LayoutOptions} from '../../core/aiChat/options/layoutOptions';
import {PersonaOptions} from '../../core/aiChat/options/personaOptions';
import {PromptBoxOptions} from '../../core/aiChat/options/promptBoxOptions';
import {ChatAdapterBuilder} from '../adapters/chat/chatAdapterBuilder';
import {ChatItem} from '../conversation';
import {EventCallback, EventName, EventsMap} from '../event';
import {AiChatProps} from './props';

/**
 * The main interface representing AiChat component.
 * It provides methods to instantiate, mount, and unmount the component, and listen to its events.
 */
export interface IAiChat {
    /**
     * Hides the chat component.
     * This does not unmount the component. It will only hide the chat component from the view.
     */
    hide(): void;

    /**
     * Mounts the chat component to the given root element.
     *
     * @param {HTMLElement} rootElement
     */
    mount(rootElement: HTMLElement): void;

    /**
     * Returns true if the chat component is mounted.
     */
    get mounted(): boolean;

    /**
     * Adds an event listener to the chat component.
     * The callback will be called when the event is emitted, with the expected event details.
     *
     * @param {EventName} event The name of the event to listen to.
     * @param {EventsMap[EventName]} callback The callback to be called, that should match the event type.
     * @returns {IAiChat}
     */
    on(event: EventName, callback: EventsMap[EventName]): IAiChat;

    /**
     * Removes all event listeners from the chat component.
     * When a valid event name is provided, it will remove all listeners for that event.
     * Otherwise, it will remove all listeners for all events.
     *
     * @param {EventName} event
     */
    removeAllEventListeners(event?: EventName): void;

    /**
     * Removes the given event listener for the specified event.
     *
     * @param {EventName} event The name of the event to remove the listener from.
     * @param {EventsMap[EventName]} callback The callback to be removed.
     */
    removeEventListener(event: EventName, callback: EventCallback): void;

    /**
     * Shows the chat component.
     * This method expects the chat component to be mounted.
     */
    show(): void;

    /**
     * Unmounts the chat component.
     * This will remove the chat component from the view and clean up its resources.
     * After unmounting, the chat component can be mounted again.
     */
    unmount(): void;

    /**
     * Updates the properties of the chat component. This method expects the chat component to be mounted.
     * The properties will be updated and the relevant parts of the chat component will be re-rendered.
     *
     * @param {Partial<AiChatProps>} props The properties to be updated.
     */
    updateProps(props: Partial<AiChatProps>): void;

    /**
     * Enabled providing an adapter to the chat component.
     * The adapter will be used to send and receive messages from the chat backend.
     * This method should be called before mounting the chat component, and it should be called only once.
     *
     * @param {ChatAdapterBuilder} adapterBuilder The builder for the chat adapter.
     **/
    withAdapter(adapterBuilder: ChatAdapterBuilder): IAiChat;

    /**
     * Enables providing a class name to the chat component.
     * The class name will be added to the root element of the chat component.
     * This method should be called before mounting the chat component, and it should be called only once.
     *
     * @param {string} className The class name to be added to the chat component.
     */
    withClassName(className: string): IAiChat;

    /**
     * Enables providing conversation options to the chat component.
     * The conversation options will be used to configure the conversation behavior.
     * This method can be called before mounting the chat component, and it can be called only once.
     *
     * @param {ConversationOptions} conversationOptions The conversation options to be used.
     */
    withConversationOptions(conversationOptions: ConversationOptions): IAiChat;

    /**
     * Enables providing an initial conversation to the chat component.
     * The initial conversation will be used to populate the chat component with a conversation history.
     * This method can be called before mounting the chat component, and it can be called only once.
     *
     * @param {ChatItem[]} initialConversation
     * @returns {IAiChat}
     */
    withInitialConversation(initialConversation: ChatItem[]): IAiChat;

    /**
     * Enables providing layout options to the chat component. The layout options will be used to configure the
     * layout of the chat component. When no layout options are provided, the default layout options will be used.
     * This method can be called before mounting the chat component, and it can be called only once.
     *
     * @param {LayoutOptions} layoutOptions The layout options to be used.
     */
    withLayoutOptions(layoutOptions: LayoutOptions): IAiChat;

    /**
     * Enables providing persona options to the chat component. The persona options will be used to configure
     * the bot and user personas in the chat component.
     * This method can be called before mounting the chat component, and it can be called only once.
     *
     * @param {PersonaOptions} personaOptions The persona options to be used.
     */
    withPersonaOptions(personaOptions: PersonaOptions): IAiChat;

    /**
     * Enables providing prompt box options to the chat component.
     * This method can be called before mounting the chat component, and it can be called only once.
     *
     * @param {PromptBoxOptions} promptBoxOptions The prompt box options to be used.
     */
    withPromptBoxOptions(promptBoxOptions: PromptBoxOptions): IAiChat;

    /**
     * Enables providing a syntax highlighter to the chat component.
     * This method can be called before mounting the chat component, and it can be called only once.
     *
     * @param {HighlighterExtension} syntaxHighlighter The syntax highlighter to be used.
     */
    withSyntaxHighlighter(syntaxHighlighter: HighlighterExtension): IAiChat;

    /**
     * Enables providing a theme to the chat component.
     * This method can be called before mounting the chat component, and it can be called only once.
     *
     * @param {string} themeId The id of the theme to be used.
     */
    withTheme(themeId: string): IAiChat;
}
