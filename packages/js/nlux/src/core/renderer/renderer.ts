import {CompChatRoom} from '../../components/chat/chat-room/model';
import {NluxContext} from '../../types/context';
import {NluxProps} from '../../types/props.ts';
import {hasCssClass} from '../../x/hasCssClass';
import {BaseComp} from '../comp/base';
import {NluxRenderingError} from '../error';
import {ConversationOptions} from '../options/conversationOptions.ts';
import {MessageOptions} from '../options/messageOptions.ts';
import {PromptBoxOptions} from '../options/promptBoxOptions.ts';

export class NluxRenderer<InboundPayload, OutboundPayload> {
    private static readonly defaultThemeName = 'kensington';

    private chatRoom: CompChatRoom | null = null;
    private readonly context: NluxContext<InboundPayload, OutboundPayload>;

    private isDestroyed: boolean = false;
    private isMounted: boolean = false;
    private rootClassName: string = 'nluxc-root';
    private rootCompClass: typeof BaseComp | null = null;
    private rootElement: HTMLElement | null = null;
    private rootElementInitialClassName: string | null;

    // TODO - Use all options in renderer
    private theContainerMaxHeight: number | null = null;
    private theConversationOptions: Readonly<ConversationOptions> | null = null;
    private theMessageOptions: Readonly<MessageOptions> | null = null;
    private thePromptBoxOptions: Readonly<PromptBoxOptions> | null = null;
    private theThemeId: string | null = null;

    constructor(
        context: NluxContext<InboundPayload, OutboundPayload>,
        rootCompClass: typeof BaseComp,
        rootElement: HTMLElement,
        props?: NluxProps,
    ) {
        const RootCompClass = rootCompClass as any;
        if (!RootCompClass || typeof RootCompClass !== 'function') {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Root component model is not a class',
            });
        }

        this.context = context;
        this.rootElement = rootElement;
        this.rootElementInitialClassName = rootElement.className;
        this.rootCompClass = rootCompClass;
        this.chatRoom = null;

        this.theThemeId = props?.themeId ?? null;
        this.theContainerMaxHeight = props?.containerMaxHeight ?? null;

        this.theConversationOptions = props?.conversationOptions ?? null;
        this.thePromptBoxOptions = props?.promptBoxOptions ?? null;
        this.theMessageOptions = props?.messageOptions ?? null;
    }

    public get mounted() {
        return this.isMounted;
    }

    public get themeId() {
        return this.theThemeId || NluxRenderer.defaultThemeName;
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

        this.rootCompClass = null;
        this.chatRoom = null;
        this.isMounted = false;
        this.isDestroyed = true;

        this.theThemeId = null;
        this.theContainerMaxHeight = null;

        this.theConversationOptions = null;
        this.thePromptBoxOptions = null;
        this.theMessageOptions = null;
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

        if (!this.rootCompClass || !this.rootElement) {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Root component or root class is not set',
            });
        }

        const CompChatRoomConstructor: typeof CompChatRoom | undefined = this.rootCompClass as any;
        if (!CompChatRoomConstructor || typeof CompChatRoomConstructor !== 'function') {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Root component model is not a class',
            });
        }

        const rootComp = new CompChatRoomConstructor('nluxc', this.context, {
            containerMaxHeight: this.theContainerMaxHeight || undefined,
            visible: true,
            promptBox: {
                placeholder: this.thePromptBoxOptions?.placeholder ?? undefined,
                autoFocus: this.thePromptBoxOptions?.autoFocus ?? undefined,
            },
        });

        if (!rootComp) {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Root component failed to instantiate',
            });
        }

        if (!hasCssClass(this.rootElement, this.rootClassName)) {
            this.rootElement.classList.add(this.rootClassName);
        }

        const themeCssClass = `nluxc-theme-${this.themeId}`;
        this.rootElement.classList.add(themeCssClass);

        rootComp.render(this.rootElement);

        if (!rootComp.rendered) {
            this.rootElement.className = this.rootElementInitialClassName || '';

            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Root component did not render',
            });
        } else {
            this.chatRoom = rootComp;
            this.isMounted = true;
        }
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
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Renderer is already destroyed and cannot be unmounted',
            });
        }

        if (!this.chatRoom || !this.rootElement) {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Root component or root element is not set',
            });
        }

        this.chatRoom.destroy();
        if (this.rootElement) {
            this.rootElement.innerHTML = '';
            this.rootElement.className = this.rootElementInitialClassName || '';
        }

        this.chatRoom = null;
        this.isMounted = false;
    }

    public updateProps(props: NluxProps) {
        if (!props) {
            return;
        }

        if (props.hasOwnProperty('themeId')) {
            this.theThemeId = props.themeId ?? null;
            // TODO - Apply new theme
        }

        if (props.hasOwnProperty('containerMaxHeight')) {
            this.theContainerMaxHeight = props.containerMaxHeight ?? null;
            this.chatRoom?.setProps({containerMaxHeight: props.containerMaxHeight});
        }

        if (props.hasOwnProperty('conversationOptions')) {
            // TODO - Apply new conversation options
        }

        if (props.hasOwnProperty('messageOptions')) {
            // TODO - Apply new message options
        }

        if (props.hasOwnProperty('promptBoxOptions')) {
            // TODO - Apply new prompt box options
        }
    }
}
