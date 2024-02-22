import {ExceptionId, NluxExceptions} from '../../exceptions/exceptions';
import {AiChatInternalProps, AiChatProps} from '../../types/aiChat/props';
import {ControllerContext} from '../../types/controllerContext';
import {EventCallback, EventName} from '../../types/event';
import {uid} from '../../x/uid';
import {warn} from '../../x/warn';
import {EventManager} from '../events/eventManager';
import {NluxRenderer} from '../renderer/renderer';
import {createControllerContext} from './context';

export class NluxController<InboundPayload = any, OutboundPayload = any> {

    private readonly eventManager = new EventManager();
    private readonly nluxInstanceId = uid();
    private props: AiChatInternalProps;

    private renderException = (exceptionId: string) => {
        if (!this.mounted || !this.renderer) {
            return null;
        }

        const exception = NluxExceptions[exceptionId as ExceptionId];
        if (!exception) {
            warn(`Exception with id '${exceptionId}' is not defined`);
            return null;
        }

        this.renderer.renderEx(exception.type, exception.message);
    };

    private renderer: NluxRenderer<InboundPayload, OutboundPayload> | null = null;
    private readonly rootCompId: string;
    private readonly rootElement: HTMLElement;

    constructor(
        rootElement: HTMLElement,
        props: AiChatInternalProps,
    ) {
        this.rootCompId = 'chat-room';
        this.rootElement = rootElement;
        this.props = props;
    }

    public get mounted() {
        return this.renderer?.mounted;
    }

    public hide() {
        if (!this.mounted) {
            return;
        }

        this.renderer?.hide();
    }

    public mount() {
        if (this.mounted) {
            return;
        }

        const newContext: ControllerContext = createControllerContext({
                instanceId: this.nluxInstanceId,
                exception: this.renderException,
                adapter: this.props.adapter,
                syntaxHighlighter: this.props.syntaxHighlighter,
            },
            () => {
                return {
                    ...this.props,
                    conversationOptions: this.props.conversationOptions && Object.keys(
                        this.props.conversationOptions).length > 0
                        ? this.props.conversationOptions
                        : undefined,
                    promptBoxOptions: this.props.promptBoxOptions && Object.keys(
                        this.props.promptBoxOptions).length > 0
                        ? this.props.promptBoxOptions
                        : undefined,
                    layoutOptions: this.props.layoutOptions && Object.keys(
                        this.props.layoutOptions).length > 0
                        ? this.props.layoutOptions
                        : undefined,
                    personaOptions: this.props.personaOptions && Object.keys(
                        this.props.personaOptions).length > 0
                        ? this.props.personaOptions
                        : undefined,
                };
            },
            this.eventManager.emit,
        );

        this.renderer = new NluxRenderer(
            newContext,
            this.rootCompId,
            this.rootElement,
            this.props,
        );

        this.renderer.mount();
    }

    public on(event: EventName, callback: EventCallback) {
        this.eventManager.on(event, callback);
    }

    removeAllEventListeners(eventName: EventName) {
        this.eventManager.removeAllEventListeners(eventName);
    }

    removeAllEventListenersForAllEvent() {
        this.eventManager.removeAllEventListenersForAllEvent();
    }

    removeEventListener(event: EventName, callback: EventCallback) {
        this.eventManager.removeEventListener(event, callback);
    }

    public show() {
        if (!this.mounted) {
            return;
        }

        this.renderer?.show();
    }

    public unmount() {
        if (!this.mounted) {
            return;
        }

        this.renderer?.unmount();
        this.renderer = null;
    }

    public updateProps(props: Partial<AiChatProps>) {
        this.renderer?.updateProps(props);
        this.props = {
            ...this.props,
            ...props,
        };

        if (props.events) {
            this.props.events = props.events;
            this.eventManager.updateEventListeners(props.events);
        }
    }
}
