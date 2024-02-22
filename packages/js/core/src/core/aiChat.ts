import {registerAllComponents} from '../components/components';
import {Adapter} from '../types/aiChat/adapter';
import {AdapterBuilder} from '../types/aiChat/adapterBuilder';
import {AiChatProps} from '../types/aiChat/props';
import {StandardAdapter} from '../types/aiChat/standardAdapter';
import {ConversationItem} from '../types/conversation';
import {EventCallback, EventName, EventsMap} from '../types/event';
import {debug} from '../x/debug';
import {NluxController} from './controller/controller';
import {NluxRenderingError, NluxUsageError, NluxValidationError} from './error';
import {HighlighterExtension} from './highlighter/highlighter';
import {IAiChat} from './interface';
import {ConversationOptions} from './options/conversationOptions';
import {LayoutOptions} from './options/layoutOptions';
import {PersonaOptions} from './options/personaOptions';
import {PromptBoxOptions} from './options/promptBoxOptions';

export class AiChat implements IAiChat {
    protected theAdapter: Adapter | null = null;
    protected theAdapterBuilder: StandardAdapter | null = null;
    protected theAdapterType: 'builder' | 'instance' | null = null;
    protected theClassName: string | null = null;
    protected theConversationOptions: ConversationOptions | null = null;
    protected theInitialConversation: ConversationItem[] | null = null;
    protected theLayoutOptions: LayoutOptions | null = null;
    protected thePersonasOptions: PersonaOptions | null = null;
    protected thePromptBoxOptions: PromptBoxOptions | null = null;
    protected theSyntaxHighlighter: HighlighterExtension | null = null;
    protected theThemeId: string | null = null;
    private controller: NluxController | null = null;
    private unregisteredEventListeners: Map<EventName, Set<EventCallback>> = new Map();

    public get mounted(): boolean {
        return this.controller?.mounted ?? false;
    }

    hide() {
        if (!this.controller) {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Unable to hide. nlux is not mounted.',
            });
        }

        this.controller.hide();
    }

    public mount(rootElement: HTMLElement) {
        if (this.mounted) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to create nlux instance. nlux is already mounted. '
                    + 'Make sure to call `unmount()` before mounting again.',
            });
        }

        const adapterToUser: Adapter | StandardAdapter | null =
            this.theAdapter && this.theAdapterType === 'instance' ? this.theAdapter
                : (this.theAdapterType === 'builder' && this.theAdapterBuilder)
                    ? this.theAdapterBuilder
                    : null;

        if (!adapterToUser) {
            throw new NluxValidationError({
                source: this.constructor.name,
                message: 'Unable to create nlux instance. Adapter is not properly set. '
                    + 'You should call `withAdapter(adapter)` method before mounting nlux.',
            });
        }

        registerAllComponents();

        rootElement.innerHTML = '';
        const controller = new NluxController(
            rootElement,
            {
                themeId: this.theThemeId ?? undefined,
                adapter: adapterToUser,
                className: this.theClassName ?? undefined,
                initialConversation: this.theInitialConversation ?? undefined,
                syntaxHighlighter: this.theSyntaxHighlighter ?? undefined,
                layoutOptions: this.theLayoutOptions ?? {},
                conversationOptions: this.theConversationOptions ?? {},
                promptBoxOptions: this.thePromptBoxOptions ?? {},
                personaOptions: this.thePersonasOptions ?? {},
            },
        );

        // Register all unregistered event listeners
        for (const [eventName, eventListeners] of this.unregisteredEventListeners.entries()) {
            for (const eventCallback of eventListeners) {
                controller.on(eventName, eventCallback);
            }
        }

        controller.mount();

        if (controller.mounted) {
            this.controller = controller;
            this.unregisteredEventListeners.clear();
        } else {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'AiChat root component did not render.',
            });
        }
    };

    on(event: EventName, callback: EventsMap[EventName]) {
        if (this.controller) {
            this.controller.on(event, callback);

            // No need to keep track of event callbacks if the controller is already mounted.
            return this;
        }

        if (!this.unregisteredEventListeners.has(event)) {
            this.unregisteredEventListeners.set(event, new Set());
        }

        this.unregisteredEventListeners.get(event)?.add(callback);
        return this;
    }

    removeAllEventListeners(event?: EventName) {
        // When no event is provided, remove all event listeners for all events.
        if (!event) {
            this.controller?.removeAllEventListenersForAllEvent();
            this.unregisteredEventListeners.clear();
            return;
        }

        // When an event is provided, remove all event listeners for that specific event.
        this.controller?.removeAllEventListeners(event);
        this.unregisteredEventListeners.get(event)?.clear();
    }

    removeEventListener(event: EventName, callback: EventCallback) {
        this.controller?.removeEventListener(event, callback);
        this.unregisteredEventListeners.get(event)?.delete(callback);
    }

    show() {
        if (!this.controller) {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Unable to show. nlux is not mounted.',
            });
        }

        this.controller.show();
    }

    public unmount() {
        debug('Unmounting nlux.');

        if (!this.controller) {
            debug('Invalid call to aiChat.unmount() on an already unmounted nlux instance!');
            return;
        }

        this.controller.unmount();
        if (this.controller.mounted) {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Unable to unmount. Root component did not unmount.',
            });
        }

        this.controller = null;
        this.unregisteredEventListeners.clear();
    }

    public updateProps(props: Partial<AiChatProps>) {
        if (!this.controller) {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Unable to update props. nlux is not mounted.',
            });
        }

        this.controller.updateProps(props);
    }

    public withAdapter(adapter: Adapter | AdapterBuilder) {
        if (this.mounted) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set adapter. nlux is already mounted.',
            });
        }

        if (this.theAdapterBuilder || this.theAdapter) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to change config. A adapter or adapter builder was already set.',
            });
        }

        if (typeof adapter !== 'object' || adapter === null) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set adapter. Invalid adapter or adapter-builder type.',
            });
        }

        const anAdapterOrAdapterBuilder = adapter as any;

        if (typeof anAdapterOrAdapterBuilder.create === 'function') {
            this.theAdapterType = 'builder';
            this.theAdapterBuilder = anAdapterOrAdapterBuilder.create();
            return this;
        }

        if (
            (typeof anAdapterOrAdapterBuilder.fetchText === 'function') ||
            (typeof anAdapterOrAdapterBuilder.streamText === 'function')
        ) {
            this.theAdapterType = 'instance';
            this.theAdapter = anAdapterOrAdapterBuilder;
            return this;
        }

        throw new NluxUsageError({
            source: this.constructor.name,
            message: 'Unable to set adapter. Invalid adapter or adapter-builder implementation! '
                + 'When an `AdapterBuilder` is provided, it must implement either `create()` method that returns an '
                + 'Adapter instance. When an Adapter instance is provided, must implement `fetchText()` and/or '
                + '`streamText()` methods. None of the above were found.',
        });
    };

    public withClassName(className: string) {
        if (this.mounted) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set class name. nlux is already mounted.',
            });
        }

        if (this.theClassName) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to change config. A class name was already set.',
            });
        }

        this.theClassName = className;
        return this;
    }

    public withConversationOptions(conversationOptions: ConversationOptions) {
        if (this.mounted) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set conversation options. nlux is already mounted.',
            });
        }

        if (this.theConversationOptions) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to change config. Conversation options were already set.',
            });
        }

        this.theConversationOptions = conversationOptions;
        return this;
    }

    public withInitialConversation(initialConversation: ConversationItem[]) {
        if (this.mounted) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set conversation history. nlux is already mounted.',
            });
        }

        if (this.theInitialConversation) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to change config. Conversation history was already set.',
            });
        }

        this.theInitialConversation = initialConversation;
        return this;
    }

    public withLayoutOptions(layoutOptions: LayoutOptions) {
        if (this.mounted) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set layout options. nlux is already mounted.',
            });
        }

        if (this.theLayoutOptions) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to change config. Layout options were already set.',
            });
        }

        this.theLayoutOptions = layoutOptions;

        return this;
    }

    public withPersonaOptions(personaOptions: PersonaOptions) {
        if (this.mounted) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set personaOptions. nlux is already mounted.',
            });
        }

        if (this.thePersonasOptions) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to change config. Personas were already set.',
            });
        }

        this.thePersonasOptions = personaOptions;
        return this;
    }

    public withPromptBoxOptions(promptBoxOptions: PromptBoxOptions) {
        if (this.mounted) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set prompt box options. nlux is already mounted.',
            });
        }

        if (this.thePromptBoxOptions) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to change config. Prompt box options were already set.',
            });
        }

        this.thePromptBoxOptions = promptBoxOptions;
        return this;
    }

    public withSyntaxHighlighter(syntaxHighlighter: HighlighterExtension) {
        if (this.mounted) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set code highlighter. nlux is already mounted.',
            });
        }

        if (this.theSyntaxHighlighter) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to change config. Code highlighter was already set.',
            });
        }

        this.theSyntaxHighlighter = syntaxHighlighter;
        return this;
    }

    withTheme(themeId: string): IAiChat {
        if (this.mounted) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set theme. nlux is already mounted.',
            });
        }

        this.theThemeId = themeId;
        return this;
    }
}
