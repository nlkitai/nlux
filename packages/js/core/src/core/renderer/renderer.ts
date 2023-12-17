import {CompChatRoom} from '../../components/chat/chat-room/chat-room.model';
import {CompChatRoomProps} from '../../components/chat/chat-room/chat-room.types';
import {CompExceptionsBox} from '../../components/miscellaneous/exceptions-box/model';
import {CompExceptionsBoxProps} from '../../components/miscellaneous/exceptions-box/types';
import {NluxContext} from '../../types/context';
import {ExceptionType} from '../../types/exception';
import {NluxProps} from '../../types/props';
import {warn} from '../../x/debug';
import {comp} from '../comp/comp';
import {CompRegistry} from '../comp/registry';
import {NluxRenderingError} from '../error';
import {HighlighterExtension} from '../highlighter/highlighter';
import {ConversationOptions} from '../options/conversationOptions';
import {LayoutOptions} from '../options/layoutOptions';
import {PromptBoxOptions} from '../options/promptBoxOptions';

export class NluxRenderer<InboundPayload, OutboundPayload> {
    private static readonly defaultThemeId = 'nova';
    private readonly context: NluxContext;
    private readonly rootClassName: string = 'nluxc-root';
    private chatRoom: CompChatRoom | null = null;
    private exceptionsBox: CompExceptionsBox | null = null;
    private isDestroyed: boolean = false;
    private isMounted: boolean = false;
    private rootCompId: string | null = null;
    private rootElement: HTMLElement | null = null;
    private rootElementInitialClassName: string | null;
    private theClassName: string | null = null;
    private theConversationOptions: Readonly<ConversationOptions> = {};
    private theLayoutOptions: Readonly<LayoutOptions> = {};
    private thePromptBoxOptions: Readonly<PromptBoxOptions> = {};
    private theSyntaxHighlighter: HighlighterExtension | null = null;
    private theThemeId: string;

    constructor(
        context: NluxContext,
        rootCompId: string,
        rootElement: HTMLElement,
        props: NluxProps | null = null,
    ) {
        if (!rootCompId) {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Root component ID is not a valid component name',
            });
        }

        this.context = context;
        this.rootElement = rootElement;
        this.rootElementInitialClassName = rootElement.className;
        this.rootCompId = rootCompId;
        this.chatRoom = null;

        this.theClassName = props?.className ?? null;
        this.theThemeId = props?.themeId ?? NluxRenderer.defaultThemeId;
        this.theSyntaxHighlighter = props?.syntaxHighlighter ?? null;

        this.theLayoutOptions = props?.layoutOptions ?? {};
        this.theConversationOptions = props?.conversationOptions ?? {};
        this.thePromptBoxOptions = props?.promptBoxOptions ?? {};
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
        this.exceptionsBox?.removeAllAlerts();
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
            rootComp = comp(CompChatRoom).withContext(this.context).withProps<CompChatRoomProps>({
                visible: true,
                scrollWhenGenerating: this.theConversationOptions?.scrollWhenGenerating ?? undefined,
                containerMaxHeight: this.theLayoutOptions?.maxHeight || undefined,
                containerHeight: this.theLayoutOptions?.height || undefined,
                containerMaxWidth: this.theLayoutOptions?.maxWidth || undefined,
                containerWidth: this.theLayoutOptions?.width || undefined,
                promptBox: {
                    placeholder: this.thePromptBoxOptions?.placeholder ?? undefined,
                    autoFocus: this.thePromptBoxOptions?.autoFocus ?? undefined,
                },
            }).create();

            const CompExceptionsBoxConstructor: typeof CompExceptionsBox | undefined = CompRegistry
                .retrieve('exceptions-box')?.model as any;

            if (CompExceptionsBoxConstructor) {
                exceptionAlert = comp(CompExceptionsBox).withContext(this.context)
                    .withProps<CompExceptionsBoxProps>({
                        containerMaxWidth: this.theLayoutOptions?.maxWidth || undefined,
                        message: undefined,
                        visible: false,
                        type: 'error',
                    }).create();
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

    public updateProps(props: NluxProps | undefined) {
        if (!props) {
            return;
        }

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

        if (props.hasOwnProperty('layoutOptions')) {
            const propsToUpdate: Partial<CompChatRoomProps> = {};
            if (props.layoutOptions?.hasOwnProperty('maxHeight')) {
                propsToUpdate.containerMaxHeight = props.layoutOptions.maxHeight;
            }

            if (props.layoutOptions?.hasOwnProperty('height')) {
                propsToUpdate.containerHeight = props.layoutOptions.height;
            }

            if (props.layoutOptions?.hasOwnProperty('maxWidth')) {
                propsToUpdate.containerMaxWidth = props.layoutOptions.maxWidth;
            }

            if (props.layoutOptions?.hasOwnProperty('width')) {
                propsToUpdate.containerWidth = props.layoutOptions.width;
            }

            this.theLayoutOptions = {
                ...this.theLayoutOptions,
                ...props.layoutOptions,
            };

            this.chatRoom?.setProps(propsToUpdate);
        }

        if (props.hasOwnProperty('conversationOptions')) {
            this.theConversationOptions = props.conversationOptions ?? {};
            this.chatRoom?.setProps({
                scrollWhenGenerating: props.conversationOptions?.scrollWhenGenerating ?? undefined,
            });
        }

        if (props.hasOwnProperty('promptBoxOptions')) {
            // TODO - Apply new prompt box options
        }

        if (props.hasOwnProperty('syntaxHighlighter')) {
            // TODO - Handle syntax highlighter change
        }
    }

    private setRootElementClassNames() {
        if (!this.rootElement) {
            return;
        }

        this.rootElement.classList.add(this.rootClassName);

        if (this.theClassName) {
            this.rootElement.classList.add(this.theClassName);
        }

        const themeCssClass = `nluxc-theme-${this.themeId}`;
        this.rootElement.classList.add(themeCssClass);
    }
}
