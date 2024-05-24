import { ChatAdapter } from '../../../../../shared/src/types/adapters/chat/chatAdapter';
import { ChatAdapterBuilder } from '../../../../../shared/src/types/adapters/chat/chatAdapterBuilder';
import { StandardChatAdapter } from '../../../../../shared/src/types/adapters/chat/standardChatAdapter';
import { ChatItem } from '../../../../../shared/src/types/conversation';
import {
  NluxRenderingError,
  NluxUsageError,
  NluxValidationError,
} from '../../../../../shared/src/types/error';
import { debug } from '../../../../../shared/src/utils/debug';
import { registerAllComponents } from '../../logic/components';
import { IAiChat } from '../../types/aiChat/aiChat';
import { UpdatableAiChatProps } from '../../types/aiChat/props';
import { EventCallback, EventName, EventsMap } from '../../types/event';
import { NluxController } from './controller/controller';
import { ConversationOptions } from './options/conversationOptions';
import { DisplayOptions } from './options/displayOptions';
import { MessageOptions } from './options/messageOptions';
import { PersonaOptions } from './options/personaOptions';
import { ComposerOptions } from './options/composerOptions';
import { SanitizerFunction, setSanitizer } from '../sanitizer';

export class AiChat<AiMsg = string> implements IAiChat<AiMsg> {
  protected theAdapter: ChatAdapter<AiMsg> | StandardChatAdapter<AiMsg> | null =
    null;
  protected theAdapterBuilder: ChatAdapterBuilder<AiMsg> | null = null;
  protected theAdapterType: 'builder' | 'instance' | null = null;
  protected theClassName: string | null = null;
  protected theConversationOptions: ConversationOptions | null = null;
  protected theDisplayOptions: DisplayOptions | null = null;
  protected theInitialConversation: ChatItem<AiMsg>[] | null = null;
  protected theMessageOptions: MessageOptions<AiMsg> | null = null;
  protected thePersonasOptions: PersonaOptions | null = null;
  protected theComposerOptions: ComposerOptions | null = null;
  private controller: NluxController<AiMsg> | null = null;
  private unregisteredEventListeners: Map<
    EventName,
    Set<EventCallback<AiMsg>>
  > = new Map();

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

  public mount(rootElement: HTMLElement, sanitizer?: SanitizerFunction) {
    if (sanitizer) {
      setSanitizer(sanitizer);
    }

    if (this.mounted) {
      throw new NluxUsageError({
        source: this.constructor.name,
        message:
          'Unable to create nlux instance. nlux is already mounted. ' +
          'Make sure to call `unmount()` before mounting again.',
      });
    }

    const adapterToUser:
      | ChatAdapter<AiMsg>
      | StandardChatAdapter<AiMsg>
      | null =
      this.theAdapter && this.theAdapterType === 'instance'
        ? this.theAdapter
        : this.theAdapterType === 'builder' && this.theAdapterBuilder
        ? this.theAdapterBuilder.create()
        : null;

    if (!adapterToUser) {
      throw new NluxValidationError({
        source: this.constructor.name,
        message:
          'Unable to create nlux instance. ChatAdapter is not properly set. ' +
          'You should call `withAdapter(adapter)` method before mounting nlux.',
      });
    }

    registerAllComponents();

    const aiChatRoot = document.createElement('div');
    rootElement.appendChild(aiChatRoot);

    const controller = new NluxController(aiChatRoot, {
      adapter: adapterToUser,
      className: this.theClassName ?? undefined,
      initialConversation: this.theInitialConversation ?? undefined,
      messageOptions: this.theMessageOptions ?? {},
      displayOptions: this.theDisplayOptions ?? {},
      conversationOptions: this.theConversationOptions ?? {},
      composerOptions: this.theComposerOptions ?? {},
      personaOptions: this.thePersonasOptions ?? {},
    });

    // Register all unregistered event listeners
    for (const [
      eventName,
      eventListeners,
    ] of this.unregisteredEventListeners.entries()) {
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
  }

  on(event: EventName, callback: EventsMap<AiMsg>[EventName]) {
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

  removeEventListener(event: EventName, callback: EventCallback<AiMsg>) {
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
      debug(
        'Invalid call to aiChat.unmount() on an already unmounted nlux instance!'
      );
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

  public updateProps(props: UpdatableAiChatProps<AiMsg>) {
    if (!this.controller) {
      throw new NluxRenderingError({
        source: this.constructor.name,
        message: 'Unable to update props. nlux is not mounted.',
      });
    }

    if (props.hasOwnProperty('adapter')) {
      this.theAdapter = props.adapter ?? null;
    }

    if (props.hasOwnProperty('events')) {
      // Re-register all event listeners
      this.removeAllEventListeners();
      for (const [eventName, eventCallback] of Object.entries(
        props.events ?? {}
      )) {
        this.on(eventName as EventName, eventCallback as EventCallback<AiMsg>);
      }
    }

    if (props.hasOwnProperty('className')) {
      this.theClassName = props.className ?? null;
    }

    if (props.hasOwnProperty('displayOptions')) {
      this.theDisplayOptions = props.displayOptions ?? null;
    }

    if (props.hasOwnProperty('composerOptions')) {
      this.theComposerOptions = props.composerOptions ?? null;
    }

    if (props.hasOwnProperty('personaOptions')) {
      this.thePersonasOptions = props.personaOptions ?? null;
    }

    if (props.hasOwnProperty('conversationOptions')) {
      this.theConversationOptions = props.conversationOptions ?? null;
    }

    if (props.hasOwnProperty('messageOptions')) {
      this.theMessageOptions = props.messageOptions ?? null;
    }

    this.controller.updateProps(props);
  }

  public withAdapter(adapter: ChatAdapter<AiMsg> | ChatAdapterBuilder<AiMsg>) {
    if (this.mounted) {
      throw new NluxUsageError({
        source: this.constructor.name,
        message: 'Unable to set adapter. nlux is already mounted.',
      });
    }

    if (this.theAdapterBuilder || this.theAdapter) {
      throw new NluxUsageError({
        source: this.constructor.name,
        message:
          'Unable to change config. A adapter or adapter builder was already set.',
      });
    }

    if (typeof adapter !== 'object' || adapter === null) {
      throw new NluxUsageError({
        source: this.constructor.name,
        message:
          'Unable to set adapter. Invalid adapter or adapter-builder type.',
      });
    }

    const anAdapterOrAdapterBuilder = adapter as Record<string, unknown>;
    if (typeof anAdapterOrAdapterBuilder.create === 'function') {
      this.theAdapterType = 'builder';
      this.theAdapterBuilder =
        anAdapterOrAdapterBuilder as unknown as ChatAdapterBuilder<AiMsg>;
      return this;
    }

    if (
      typeof anAdapterOrAdapterBuilder.fetchText === 'function' ||
      typeof anAdapterOrAdapterBuilder.streamText === 'function'
    ) {
      this.theAdapterType = 'instance';
      this.theAdapter = anAdapterOrAdapterBuilder as ChatAdapter<AiMsg>;
      return this;
    }

    throw new NluxUsageError({
      source: this.constructor.name,
      message:
        'Unable to set adapter. Invalid adapter or adapter-builder implementation! ' +
        'When an `ChatAdapterBuilder` is provided, it must implement either `create()` method that returns an ' +
        'ChatAdapter instance. When an ChatAdapter instance is provided, must implement `fetchText()` and/or ' +
        '`streamText()` methods. None of the above were found.',
    });
  }

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
        message:
          'Unable to change config. Conversation options were already set.',
      });
    }

    this.theConversationOptions = { ...conversationOptions };
    return this;
  }

  public withDisplayOptions(displayOptions: DisplayOptions) {
    if (this.mounted) {
      throw new NluxUsageError({
        source: this.constructor.name,
        message: 'Unable to set display options. nlux is already mounted.',
      });
    }

    if (this.theDisplayOptions) {
      throw new NluxUsageError({
        source: this.constructor.name,
        message: 'Unable to change config. Display options were already set.',
      });
    }

    this.theDisplayOptions = { ...displayOptions };
    return this;
  }

  public withInitialConversation(initialConversation: ChatItem<AiMsg>[]) {
    if (this.mounted) {
      throw new NluxUsageError({
        source: this.constructor.name,
        message: 'Unable to set conversation history. nlux is already mounted.',
      });
    }

    if (this.theInitialConversation) {
      throw new NluxUsageError({
        source: this.constructor.name,
        message:
          'Unable to change config. Conversation history was already set.',
      });
    }

    this.theInitialConversation = [...initialConversation];
    return this;
  }

  public withMessageOptions(messageOptions: MessageOptions<AiMsg>) {
    if (this.mounted) {
      throw new NluxUsageError({
        source: this.constructor.name,
        message: 'Unable to set message options. nlux is already mounted.',
      });
    }

    if (this.theMessageOptions) {
      throw new NluxUsageError({
        source: this.constructor.name,
        message: 'Unable to change config. Message options were already set.',
      });
    }

    this.theMessageOptions = { ...messageOptions };
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

    this.thePersonasOptions = { ...personaOptions };
    return this;
  }

  public withComposerOptions(composerOptions: ComposerOptions) {
    if (this.mounted) {
      throw new NluxUsageError({
        source: this.constructor.name,
        message: 'Unable to set composer options. nlux is already mounted.',
      });
    }

    if (this.theComposerOptions) {
      throw new NluxUsageError({
        source: this.constructor.name,
        message: 'Unable to change config. Composer options were already set.',
      });
    }

    this.theComposerOptions = { ...composerOptions };
    return this;
  }
}
