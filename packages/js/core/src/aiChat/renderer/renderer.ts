import {ChatItem} from '@shared/types/conversation';
import {NluxRenderingError} from '@shared/types/error';
import {NLErrorId} from '@shared/types/exceptions/errors';
import {emptyInnerHtml} from '@shared/utils/dom/emptyInnerHtml';
import {getConversationLayout} from '@shared/utils/dom/getConversationLayout';
import {getRootClassNames} from '@shared/utils/dom/getRootClassNames';
import {warn} from '@shared/utils/warn';
import {CompChatRoom} from '../../sections/chat/chatRoom/chatRoom.model';
import {CompChatRoomProps} from '../../sections/chat/chatRoom/chatRoom.types';
import {CompExceptionsBox} from '../../sections/miscellaneous/exceptionsBox/model';
import {AiChatInternalProps, UpdatableAiChatProps} from '../../types/aiChat/props';
import {propsToCorePropsInEvents} from '../../utils/propsToCorePropsInEvents';
import {comp} from '../comp/comp';
import {CompRegistry} from '../comp/registry';
import {ConversationOptions} from '../options/conversationOptions';
import {DisplayOptions} from '../options/displayOptions';
import {MessageOptions} from '../options/messageOptions';
import {PersonaOptions} from '../options/personaOptions';
import {ComposerOptions} from '../options/composerOptions';
import {ControllerContext} from '../../types/controllerContext';

export class NluxRenderer<AiMsg> {
    private readonly __context: ControllerContext<AiMsg>;

    private chatRoom: CompChatRoom<AiMsg> | null = null;
    private exceptionsBox: CompExceptionsBox<AiMsg> | null = null;
    private isDestroyed: boolean = false;
    private isMounted: boolean = false;
    private rootCompId: string | null = null;
    private rootElement: HTMLElement | null = null;
    private rootElementInitialClassName: string | null;

    private theClassName: string | null = null;
    private theConversationOptions: ConversationOptions = {};
    private theDisplayOptions: DisplayOptions = {};
    private theInitialConversationContent: ChatItem<AiMsg>[] | null = null;
    private theMessageOptions: MessageOptions<AiMsg> = {};
    private thePersonasOptions: PersonaOptions = {};
    private theComposerOptions: ComposerOptions = {};

    constructor(
        context: ControllerContext<AiMsg>,
        rootCompId: string,
        rootElement: HTMLElement,
        props: AiChatInternalProps<AiMsg> | null = null,
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
        this.theDisplayOptions = props?.displayOptions ?? {};
        this.theConversationOptions = props?.conversationOptions ?? {};
        this.theMessageOptions = props?.messageOptions ?? {};
        this.theInitialConversationContent = props?.initialConversation ?? null;
        this.theComposerOptions = props?.composerOptions ?? {};
        this.thePersonasOptions = props?.personaOptions ?? {};
    }

    public get className(): string | undefined {
        return this.theClassName ?? undefined;
    }

    public get colorScheme(): 'light' | 'dark' | 'auto' | undefined {
        return this.theDisplayOptions.colorScheme;
    }

    get context() {
        return this.__context;
    }

    public get mounted() {
        return this.isMounted;
    }

    public get themeId() {
        return this.theDisplayOptions.themeId;
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

        this.theDisplayOptions = {};
        this.theConversationOptions = {};
        this.theComposerOptions = {};
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

        let rootComp: CompChatRoom<AiMsg> | null = null;
        let exceptionAlert: CompExceptionsBox<AiMsg> | null = null;

        try {
            // Root component can only be a chat room component.
            if (this.rootCompId !== 'chatRoom') {
                throw new NluxRenderingError({
                    source: this.constructor.name,
                    message: 'Root component is not a chat room',
                });
            }

            //
            // IMPORTANT ✨ This is where the CompChatRoom is instantiated!
            //
            rootComp = comp(CompChatRoom<AiMsg>)
                .withContext(this.context)
                .withProps<CompChatRoomProps<AiMsg>>({
                    visible: true,
                    conversationLayout: getConversationLayout(this.theConversationOptions.layout),
                    assistantPersona: this.thePersonasOptions?.assistant ?? undefined,
                    userPersona: this.thePersonasOptions?.user ?? undefined,
                    conversationStarters: this.theConversationOptions?.conversationStarters ?? undefined,
                    showWelcomeMessage: this.theConversationOptions?.showWelcomeMessage,
                    initialConversationContent: this.theInitialConversationContent ?? undefined,
                    autoScroll: this.theConversationOptions?.autoScroll,
                    syntaxHighlighter: this.context.syntaxHighlighter,
                    htmlSanitizer: this.context.htmlSanitizer,
                    markdownLinkTarget: this.theMessageOptions?.markdownLinkTarget,
                    showCodeBlockCopyButton: this.theMessageOptions?.showCodeBlockCopyButton,
                    streamingAnimationSpeed: this.theMessageOptions?.streamingAnimationSpeed,
                    skipStreamingAnimation: this.theMessageOptions?.skipStreamingAnimation,
                    composer: {
                        placeholder: this.theComposerOptions?.placeholder,
                        autoFocus: this.theComposerOptions?.autoFocus,
                        disableSubmitButton: this.theComposerOptions?.disableSubmitButton,
                        submitShortcut: this.theComposerOptions?.submitShortcut,
                    },
                }).create();

            const CompExceptionsBoxConstructor = CompRegistry.retrieve(
                'exceptionsBox',
            )?.model as typeof CompExceptionsBox | undefined;

            if (CompExceptionsBoxConstructor) {
                exceptionAlert = comp(CompExceptionsBox<AiMsg>)
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
            this.setRoomElementDimensions(this.theDisplayOptions);

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
        } catch (_error) {
            this.rootElement.className = this.rootElementInitialClassName || '';
            this.renderEx('failed-to-render-content', _error?.toString() ?? 'Unknown error');
        }
    }

    public renderEx(type: NLErrorId, message: string) {
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
            aiChatProps: propsToCorePropsInEvents(this.context.aiChatProps),
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
            emptyInnerHtml(this.rootElement);
            this.rootElement.className = this.rootElementInitialClassName || '';
        }

        this.chatRoom = null;
        this.exceptionsBox = null;
        this.isMounted = false;
    }

    public updateProps(props: UpdatableAiChatProps<AiMsg>) {
        if (props.hasOwnProperty('adapter') && props.adapter) {
            this.context.update({
                adapter: props.adapter,
            });
        }

        let classNameUpdated = false;
        if (props.hasOwnProperty('className') && props.className !== this.className) {
            this.theClassName = props.className ?? null;
            classNameUpdated = true;
        }

        let themeIdUpdated = false;
        let colorSchemeUpdated = false;
        let transparentBackgroundUpdated = false;

        if (props.hasOwnProperty('displayOptions')) {
            const newDisplayOptions: Partial<DisplayOptions> = {};

            if (props.displayOptions?.themeId !== this.theDisplayOptions.themeId) {
                newDisplayOptions.themeId = props.displayOptions?.themeId;
                themeIdUpdated = true;
            }

            if (props.displayOptions?.colorScheme !== this.theDisplayOptions.colorScheme) {
                newDisplayOptions.colorScheme = props.displayOptions?.colorScheme;
                colorSchemeUpdated = true;
            }

            if (props.displayOptions?.transparentBackground !== this.theDisplayOptions.transparentBackground) {
                newDisplayOptions.transparentBackground = props.displayOptions?.transparentBackground;
                transparentBackgroundUpdated = true;
            }

            if (props.displayOptions?.height !== this.theDisplayOptions.height) {
                newDisplayOptions.height = props.displayOptions?.height;
            }

            if (props.displayOptions?.width !== this.theDisplayOptions.width) {
                newDisplayOptions.width = props.displayOptions?.width;
            }

            if (Object.keys(newDisplayOptions).length > 0) {
                const displayOptions: DisplayOptions = {
                    ...this.theDisplayOptions,
                    ...newDisplayOptions,
                };

                this.theDisplayOptions = displayOptions;
                this.setRoomElementDimensions(displayOptions);
            }
        }

        if (themeIdUpdated || colorSchemeUpdated || classNameUpdated || transparentBackgroundUpdated) {
            this.setRootElementClassNames();
        }

        if (props.hasOwnProperty('conversationOptions')) {
            const newConversationOptions: Partial<ConversationOptions> = {};
            const newProps: Partial<CompChatRoomProps<AiMsg>> = {};

            if (props.conversationOptions?.layout !== this.theConversationOptions.layout) {
                newConversationOptions.layout = props.conversationOptions?.layout;
                newProps.conversationLayout = getConversationLayout(props.conversationOptions?.layout);
            }

            if (props.conversationOptions?.autoScroll !== this.theConversationOptions.autoScroll) {
                newConversationOptions.autoScroll = props.conversationOptions?.autoScroll;
                newProps.autoScroll = props.conversationOptions?.autoScroll;
            }

            if (props.conversationOptions?.showWelcomeMessage !== this.theConversationOptions.showWelcomeMessage) {
                newConversationOptions.showWelcomeMessage = props.conversationOptions?.showWelcomeMessage;
                newProps.showWelcomeMessage = props.conversationOptions?.showWelcomeMessage;
            }

            if (props.conversationOptions?.conversationStarters !== this.theConversationOptions.conversationStarters) {
                newConversationOptions.conversationStarters = props.conversationOptions?.conversationStarters;
                newProps.conversationStarters = props.conversationOptions?.conversationStarters;
            }

            if (Object.keys(newConversationOptions).length > 0) {
                this.theConversationOptions = {
                    ...this.theConversationOptions,
                    ...newConversationOptions,
                };

                this.chatRoom?.setProps(newProps);
            }
        }

        if (props.hasOwnProperty('messageOptions')) {
            this.theMessageOptions = props.messageOptions ?? {};
            this.chatRoom?.setProps({
                streamingAnimationSpeed: props.messageOptions?.streamingAnimationSpeed ?? undefined,
                markdownLinkTarget: props.messageOptions?.markdownLinkTarget ?? undefined,
                syntaxHighlighter: props.messageOptions?.syntaxHighlighter,
                htmlSanitizer: props.messageOptions?.htmlSanitizer,
            });

            this.context.update({
                syntaxHighlighter: props.messageOptions?.syntaxHighlighter,
                htmlSanitizer: props.messageOptions?.htmlSanitizer,
            });
        }

        if (props.hasOwnProperty('composerOptions')) {
            const changedComposerOptions: Partial<ComposerOptions> = {};

            if (
                props.composerOptions?.hasOwnProperty('placeholder')
                && props.composerOptions.placeholder !== this.theComposerOptions.placeholder
            ) {
                changedComposerOptions.placeholder = props.composerOptions.placeholder;
            }

            if (
                props.composerOptions?.hasOwnProperty('autoFocus')
                && props.composerOptions.autoFocus !== this.theComposerOptions.autoFocus
            ) {
                changedComposerOptions.autoFocus = props.composerOptions.autoFocus;
            }

            if (
                props.composerOptions?.hasOwnProperty('disableSubmitButton')
                && props.composerOptions.disableSubmitButton !== this.theComposerOptions.disableSubmitButton
            ) {
                changedComposerOptions.disableSubmitButton = props.composerOptions.disableSubmitButton;
            }

            if (
                props.composerOptions?.hasOwnProperty('submitShortcut')
                && props.composerOptions.submitShortcut !== this.theComposerOptions.submitShortcut
            ) {
                changedComposerOptions.submitShortcut = props.composerOptions.submitShortcut;
            }

            if (Object.keys(changedComposerOptions).length > 0) {
                this.theComposerOptions = {
                    ...this.theComposerOptions,
                    ...changedComposerOptions,
                };

                this.chatRoom?.setProps({
                    composer: this.theComposerOptions,
                });
            }
        }

        if (props.hasOwnProperty('personaOptions')) {
            const changedPersonaProps: Partial<CompChatRoomProps<AiMsg>> = {};
            if (props.personaOptions?.assistant !== this.thePersonasOptions?.assistant) {
                changedPersonaProps.assistantPersona = props.personaOptions?.assistant ?? undefined;
            }

            if (props.personaOptions?.user !== this.thePersonasOptions?.user) {
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
            className: this.className,
            colorScheme: this.colorScheme,
            transparentBackground: this.theDisplayOptions.transparentBackground,
        });

        this.rootElement.className = '';
        this.rootElement.classList.add(...rootClassNames);
    }
}
