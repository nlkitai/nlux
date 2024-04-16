import {getRootClassNames} from '../../../../../../shared/src/dom/getRootClassNames';
import {ExceptionType} from '../../../../../../shared/src/types/exception';
import {warn} from '../../../../../../shared/src/utils/warn';
import {CompChatRoom} from '../../../logic/chat/chat-room/chat-room.model';
import {CompChatRoomProps} from '../../../logic/chat/chat-room/chat-room.types';
import {CompExceptionsBox} from '../../../logic/miscellaneous/exceptions-box/model';
import {AiChatInternalProps, AiChatProps} from '../../../types/aiChat/props';
import {ControllerContext} from '../../../types/controllerContext';
import {ChatItem} from '../../../types/conversation';
import {NluxRenderingError} from '../../error';
import {comp} from '../comp/comp';
import {CompRegistry} from '../comp/registry';
import {ConversationOptions} from '../options/conversationOptions';
import {LayoutOptions} from '../options/layoutOptions';
import {PersonaOptions} from '../options/personaOptions';
import {PromptBoxOptions} from '../options/promptBoxOptions';

export class NluxRenderer {
    private static readonly defaultThemeId = 'luna';

    private readonly __context: ControllerContext;

    private chatRoom: CompChatRoom | null = null;
    private exceptionsBox: CompExceptionsBox | null = null;
    private isDestroyed: boolean = false;
    private isMounted: boolean = false;
    private readonly rootClassName: string = 'nlux-AiChat-root';
    private rootCompId: string | null = null;
    private rootElement: HTMLElement | null = null;
    private rootElementInitialClassName: string | null;
    private theClassName: string | null = null;
    private theConversationOptions: Readonly<ConversationOptions> = {};
    private theInitialConversationContent: Readonly<ChatItem[]> | null = null;
    private theLayoutOptions: Readonly<LayoutOptions> = {};
    private thePersonasOptions: Readonly<PersonaOptions> = {};
    private thePromptBoxOptions: Readonly<PromptBoxOptions> = {};
    private theThemeId: string;

    constructor(
        context: ControllerContext,
        rootCompId: string,
        rootElement: HTMLElement,
        props: AiChatInternalProps | null = null,
    ) {
        if (!rootCompId) {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Root component ID is not a valid component name',
            });
        }

        this.__context = context;

        this.rootElement = rootElement;
        this.rootElementInitialClassName = rootElement.className;
        this.rootCompId = rootCompId;
        this.chatRoom = null;

        this.theClassName = props?.className ?? null;
        this.theThemeId = props?.themeId ?? NluxRenderer.defaultThemeId;

        this.theLayoutOptions = props?.layoutOptions ?? {};
        this.theConversationOptions = props?.conversationOptions ?? {};
        this.theInitialConversationContent = props?.initialConversation ?? null;
        this.thePromptBoxOptions = props?.promptBoxOptions ?? {};
        this.thePersonasOptions = props?.personaOptions ?? {};
    }

    get context() {
        return this.__context;
    }

    public get mounted() {
        return this.isMounted;
    }

    public get themeId() {
        return this.theThemeId;
    }

    destroy() {
        if (this.mounted) {
            this.unmount();
        }

        if (this.chatRoom) {
            this.chatRoom.destroy();
        }

        this.rootElement = null;
        this.rootElementInitialClassName = null;

        this.rootCompId = null;
        this.chatRoom = null;
        this.isMounted = false;
        this.isDestroyed = true;

        this.theLayoutOptions = {};
        this.theConversationOptions = {};
        this.thePromptBoxOptions = {};
    }

    hide() {
        if (!this.mounted) {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Renderer is not mounted and cannot be hidden',
            });
        }

        this.chatRoom?.hide();
    }

    mount() {
        if (this.isDestroyed) {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Renderer is destroyed and cannot be mounted',
            });
        }

        if (!this.rootCompId || !this.rootElement) {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Root component or root class is not set',
            });
        }

        let rootComp: CompChatRoom | null = null;
        let exceptionAlert: CompExceptionsBox | null = null;

        try {
            // Root component can only be a chat room component.
            if (this.rootCompId !== 'chat-room') {
                throw new NluxRenderingError({
                    source: this.constructor.name,
                    message: 'Root component is not a chat room',
                });
            }

            //
            // IMPORTANT ✨ This is where the CompChatRoom is instantiated!
            //
            rootComp = comp(CompChatRoom)
                .withContext(this.context)
                .withProps<CompChatRoomProps>({
                    visible: true,
                    botPersona: this.thePersonasOptions?.bot ?? undefined,
                    userPersona: this.thePersonasOptions?.user ?? undefined,
                    initialConversationContent: this.theInitialConversationContent ?? undefined,
                    scrollWhenGenerating: this.theConversationOptions?.scrollWhenGenerating,
                    streamingAnimationSpeed: this.theConversationOptions?.streamingAnimationSpeed,
                    promptBox: {
                        placeholder: this.thePromptBoxOptions?.placeholder ?? undefined,
                        autoFocus: this.thePromptBoxOptions?.autoFocus ?? undefined,
                        disableSubmitButton: this.thePromptBoxOptions?.disableSubmitButton ?? undefined,
                        submitShortcut: this.thePromptBoxOptions?.submitShortcut ?? undefined,
                    },
                }).create();

            const CompExceptionsBoxConstructor: typeof CompExceptionsBox | undefined = CompRegistry
                .retrieve('exceptions-box')?.model as any;

            if (CompExceptionsBoxConstructor) {
                exceptionAlert = comp(CompExceptionsBox)
                    .withContext(this.context)
                    .create();
            } else {
                warn('Exception alert component is not registered! No exceptions will be shown.');
            }

            if (!rootComp) {
                throw new NluxRenderingError({
                    source: this.constructor.name,
                    message: 'Root component failed to instantiate',
                });
            }

            this.setRootElementClassNames();
            this.setRoomElementDimensions(this.theLayoutOptions);

            if (exceptionAlert) {
                exceptionAlert.render(this.rootElement);
            }

            rootComp.render(this.rootElement);

            if (rootComp && !rootComp.rendered) {
                this.rootElement.className = this.rootElementInitialClassName || '';

                throw new NluxRenderingError({
                    source: this.constructor.name,
                    message: 'Root component did not render',
                });
            } else {
                this.chatRoom = rootComp;
                this.exceptionsBox = exceptionAlert ?? null;
                this.isMounted = true;
            }
        } catch (e) {
            this.rootElement.className = this.rootElementInitialClassName || '';
            this.renderEx('error', e?.toString() ?? 'Unknown error');
        }
    }

    public renderEx(type: ExceptionType, message: string) {
        if (!this.mounted) {
            warn('Renderer is not mounted and cannot render exceptions');
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: message,
            });
        }

        this.exceptionsBox?.showAlert(type, message);
    }

    show() {
        if (!this.mounted) {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Renderer is not mounted and cannot be shown',
            });
        }

        this.chatRoom?.show();
    }

    unmount() {
        if (this.isDestroyed) {
            warn('Renderer is destroyed and cannot be unmounted');
            return;
        }

        if (!this.chatRoom || !this.rootElement) {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Root component or root element is not set',
            });
        }

        //
        // Trigger pre-destroy event
        //
        this.context.emit('preDestroy', {
            aiChatProps: this.context.aiChatProps,
            conversationHistory: this.chatRoom.getConversationContentForAdapter(
                this.context.aiChatProps.conversationOptions?.historyPayloadSize,
            ) ?? [],
        });

        //
        // Destroy UI components
        //
        if (this.exceptionsBox) {
            this.exceptionsBox.destroy();
        }

        this.chatRoom.destroy();
        if (this.rootElement) {
            this.rootElement.innerHTML = '';
            this.rootElement.className = this.rootElementInitialClassName || '';
        }

        this.chatRoom = null;
        this.exceptionsBox = null;
        this.isMounted = false;
    }

    public updateProps(props: Partial<AiChatProps>) {
        if (props.hasOwnProperty('className')) {
            const newClassName = props.className || undefined;
            if (newClassName) {
                if (this.theClassName) {
                    this.rootElement?.classList.remove(this.theClassName);
                }

                this.theClassName = newClassName;
                this.rootElement?.classList.add(newClassName);
            } else {
                if (this.theClassName) {
                    this.rootElement?.classList.remove(this.theClassName);
                    this.theClassName = null;
                }
            }
        }

        if (props.hasOwnProperty('themeId')) {
            const newThemeId = props.themeId ?? NluxRenderer.defaultThemeId;
            if (newThemeId !== this.theThemeId) {
                this.theThemeId = newThemeId;
                this.setRootElementClassNames();
            }
        }

        if (props.hasOwnProperty('adapter') && props.adapter) {
            this.context.update({
                adapter: props.adapter,
            });
        }

        if (props.hasOwnProperty('layoutOptions')) {
            const newLayoutOptions: Partial<LayoutOptions> = {};
            if (props.layoutOptions?.hasOwnProperty('height')) {
                newLayoutOptions.height = props.layoutOptions.height;
            }

            if (props.layoutOptions?.hasOwnProperty('width')) {
                newLayoutOptions.width = props.layoutOptions.width;
            }

            if (Object.keys(newLayoutOptions).length > 0) {
                this.theLayoutOptions = {
                    ...this.theLayoutOptions,
                    ...newLayoutOptions,
                };

                this.setRoomElementDimensions(newLayoutOptions);
            }
        }

        if (props.hasOwnProperty('conversationOptions')) {
            this.theConversationOptions = props.conversationOptions ?? {};
            this.chatRoom?.setProps({
                scrollWhenGenerating: props.conversationOptions?.scrollWhenGenerating ?? undefined,
                streamingAnimationSpeed: props.conversationOptions?.streamingAnimationSpeed ?? undefined,
            });
        }

        if (props.hasOwnProperty('promptBoxOptions')) {
            const changedPromptBoxOptions: Partial<PromptBoxOptions> = {};

            if (
                props.promptBoxOptions?.hasOwnProperty('placeholder')
                && props.promptBoxOptions.placeholder !== this.thePromptBoxOptions.placeholder
            ) {
                changedPromptBoxOptions.placeholder = props.promptBoxOptions.placeholder;
            }

            if (
                props.promptBoxOptions?.hasOwnProperty('autoFocus')
                && props.promptBoxOptions.autoFocus !== this.thePromptBoxOptions.autoFocus
            ) {
                changedPromptBoxOptions.autoFocus = props.promptBoxOptions.autoFocus;
            }

            if (
                props.promptBoxOptions?.hasOwnProperty('disableSubmitButton')
                && props.promptBoxOptions.disableSubmitButton !== this.thePromptBoxOptions.disableSubmitButton
            ) {
                changedPromptBoxOptions.disableSubmitButton = props.promptBoxOptions.disableSubmitButton;
            }

            if (
                props.promptBoxOptions?.hasOwnProperty('submitShortcut')
                && props.promptBoxOptions.submitShortcut !== this.thePromptBoxOptions.submitShortcut
            ) {
                changedPromptBoxOptions.submitShortcut = props.promptBoxOptions.submitShortcut;
            }

            if (Object.keys(changedPromptBoxOptions).length > 0) {
                this.thePromptBoxOptions = {
                    ...this.thePromptBoxOptions,
                    ...changedPromptBoxOptions,
                };

                this.chatRoom?.setProps({
                    promptBox: this.thePromptBoxOptions,
                });
            }
        }

        if (props.hasOwnProperty('syntaxHighlighter')) {
            // TODO - Handle syntax highlighter change
        }

        if (props.hasOwnProperty('personaOptions')) {
            const changedPersonaProps: Partial<CompChatRoomProps> = {};
            if (
                props.personaOptions?.hasOwnProperty('bot') &&
                props.personaOptions.bot !== this.thePersonasOptions?.bot
            ) {
                changedPersonaProps.botPersona = props.personaOptions?.bot ?? undefined;
            }

            if (
                props.personaOptions?.hasOwnProperty('user') &&
                props.personaOptions?.user !== this.thePersonasOptions?.user
            ) {
                changedPersonaProps.userPersona = props.personaOptions?.user ?? undefined;
            }

            this.thePersonasOptions = {
                ...this.thePersonasOptions,
                ...props.personaOptions,
            };

            this.chatRoom?.setProps(changedPersonaProps);
        }
    }

    private setRoomElementDimensions(newDimensions: {
        width?: number | string;
        height?: number | string;
    }) {
        if (!this.rootElement) {
            return;
        }

        this.rootElement.style.minWidth = '280px';
        this.rootElement.style.minHeight = '280px';

        if (newDimensions.hasOwnProperty('width')) {
            this.rootElement.style.width = (typeof newDimensions.width === 'number') ? `${newDimensions.width}px` : (
                typeof newDimensions.width === 'string' ? newDimensions.width : ''
            );
        }

        if (newDimensions.hasOwnProperty('height')) {
            this.rootElement.style.height = (typeof newDimensions.height === 'number') ? `${newDimensions.height}px` : (
                typeof newDimensions.height === 'string' ? newDimensions.height : ''
            );
        }
    }

    private setRootElementClassNames() {
        if (!this.rootElement) {
            return;
        }

        const rootClassNames = getRootClassNames({
            themeId: this.themeId,
            rootClassName: this.rootClassName,
        });

        if (this.theClassName) {
            rootClassNames.push(this.theClassName);
        }

        this.rootElement.className = '';
        this.rootElement.classList.add(...rootClassNames);
    }
}
