import {ChatItem} from '../../../../../../shared/src/types/conversation';
import {NluxRenderingError} from '../../../../../../shared/src/types/error';
import {NLErrorId} from '../../../../../../shared/src/types/exceptions/errors';
import {getRootClassNames} from '../../../../../../shared/src/utils/dom/getRootClassNames';
import {warn} from '../../../../../../shared/src/utils/warn';
import {CompChatRoom} from '../../../logic/chat/chatRoom/chatRoom.model';
import {CompChatRoomProps} from '../../../logic/chat/chatRoom/chatRoom.types';
import {CompExceptionsBox} from '../../../logic/miscellaneous/exceptionsBox/model';
import {AiChatInternalProps, UpdatableAiChatProps} from '../../../types/aiChat/props';
import {ControllerContext} from '../../../types/controllerContext';
import {propsToCorePropsInEvents} from '../../../utils/propsToCorePropsInEvents';
import {comp} from '../comp/comp';
import {CompRegistry} from '../comp/registry';
import {ConversationOptions} from '../options/conversationOptions';
import {DisplayOptions} from '../options/displayOptions';
import {MessageOptions} from '../options/messageOptions';
import {PersonaOptions} from '../options/personaOptions';
import {PromptBoxOptions} from '../options/promptBoxOptions';

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
    private thePromptBoxOptions: PromptBoxOptions = {};

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
        this.thePromptBoxOptions = props?.promptBoxOptions ?? {};
        this.thePersonasOptions = props?.personaOptions ?? {};
    }

    public get className(): string | undefined {
        return this.theClassName ?? undefined;
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
                    botPersona: this.thePersonasOptions?.bot ?? undefined,
                    userPersona: this.thePersonasOptions?.user ?? undefined,
                    initialConversationContent: this.theInitialConversationContent ?? undefined,
                    autoScroll: this.theConversationOptions?.autoScroll,
                    syntaxHighlighter: this.context.syntaxHighlighter,
                    markdownLinkTarget: this.theMessageOptions?.markdownLinkTarget,
                    showCodeBlockCopyButton: this.theMessageOptions?.showCodeBlockCopyButton,
                    streamingAnimationSpeed: this.theMessageOptions?.streamingAnimationSpeed,
                    skipStreamingAnimation: false,
                    promptBox: {
                        placeholder: this.thePromptBoxOptions?.placeholder,
                        autoFocus: this.thePromptBoxOptions?.autoFocus,
                        disableSubmitButton: this.thePromptBoxOptions?.disableSubmitButton,
                        submitShortcut: this.thePromptBoxOptions?.submitShortcut,
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
            this.rootElement.innerHTML = '';
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
        if (props.hasOwnProperty('displayOptions')) {
            const newDisplayOptions: Partial<DisplayOptions> = {};

            if (props.displayOptions?.hasOwnProperty('height')) {
                newDisplayOptions.height = props.displayOptions.height;
            }

            if (props.displayOptions?.hasOwnProperty('width')) {
                newDisplayOptions.width = props.displayOptions.width;
            }

            if (props.displayOptions?.themeId !== this.theDisplayOptions.themeId) {
                newDisplayOptions.themeId = props.displayOptions?.themeId;
                themeIdUpdated = true;
            }

            if (Object.keys(newDisplayOptions).length > 0) {
                this.theDisplayOptions = {
                    ...this.theDisplayOptions,
                    ...newDisplayOptions,
                };

                this.setRoomElementDimensions(newDisplayOptions);
            }
        }

        if (themeIdUpdated || classNameUpdated) {
            this.setRootElementClassNames();
        }

        if (props.hasOwnProperty('conversationOptions')) {
            this.theConversationOptions = props.conversationOptions ?? {};
            this.chatRoom?.setProps({
                autoScroll: props.conversationOptions?.autoScroll ?? undefined,
                syntaxHighlighter: this.context.syntaxHighlighter ?? undefined,
                skipStreamingAnimation: false,
            });
        }

        if (props.hasOwnProperty('messageOptions')) {
            this.theMessageOptions = props.messageOptions ?? {};
            this.chatRoom?.setProps({
                streamingAnimationSpeed: props.messageOptions?.streamingAnimationSpeed ?? undefined,
                markdownLinkTarget: props.messageOptions?.markdownLinkTarget ?? undefined,
                syntaxHighlighter: props.messageOptions?.syntaxHighlighter,
            });

            this.context.update({
                syntaxHighlighter: props.messageOptions?.syntaxHighlighter,
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

        if (props.hasOwnProperty('personaOptions')) {
            const changedPersonaProps: Partial<CompChatRoomProps<AiMsg>> = {};
            if (props.personaOptions?.bot !== this.thePersonasOptions?.bot) {
                changedPersonaProps.botPersona = props.personaOptions?.bot ?? undefined;
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
            className: this.className,
        });

        this.rootElement.className = '';
        this.rootElement.classList.add(...rootClassNames);
    }
}
