import {ExceptionId, NluxExceptions} from '../../../../../../shared/src/types/exceptions';
import {uid} from '../../../../../../shared/src/utils/uid';
import {warn} from '../../../../../../shared/src/utils/warn';
import {AiChatInternalProps, AiChatProps, UpdatableAiChatProps} from '../../../types/aiChat/props';
import {ControllerContext} from '../../../types/controllerContext';
import {EventCallback, EventName} from '../../../types/event';
import {EventManager} from '../events/eventManager';
import {NluxRenderer} from '../renderer/renderer';
import {createControllerContext} from './context';

export class NluxController<AiMsg> {

    private readonly eventManager = new EventManager<AiMsg>();
    private internalProps: AiChatInternalProps<AiMsg>;
    private readonly nluxInstanceId = uid();

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

    private renderer: NluxRenderer<AiMsg> | null = null;
    private readonly rootCompId: string;
    private readonly rootElement: HTMLElement;

    constructor(
        rootElement: HTMLElement,
        props: AiChatInternalProps<AiMsg>,
    ) {
        this.rootCompId = 'chatRoom';
        this.rootElement = rootElement;
        this.internalProps = props;
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

        const newContext: ControllerContext<AiMsg> = createControllerContext<AiMsg>({
                instanceId: this.nluxInstanceId,
                exception: this.renderException,
                adapter: this.internalProps.adapter,
                syntaxHighlighter: this.internalProps.messageOptions.syntaxHighlighter,
            },
            () => this.getUpdatedAiChatPropsFromInternalProps(this.internalProps),
            this.eventManager.emit,
        );

        this.renderer = new NluxRenderer(
            newContext,
            this.rootCompId,
            this.rootElement,
            this.internalProps,
        );

        this.renderer.mount();
    }

    public on(event: EventName, callback: EventCallback<AiMsg>) {
        this.eventManager.on(event, callback);
    }

    removeAllEventListeners(eventName: EventName) {
        this.eventManager.removeAllEventListeners(eventName);
    }

    removeAllEventListenersForAllEvent() {
        this.eventManager.removeAllEventListenersForAllEvent();
    }

    removeEventListener(event: EventName, callback: EventCallback<AiMsg>) {
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

    public updateProps(props: UpdatableAiChatProps<AiMsg>) {
        this.renderer?.updateProps(props);
        this.internalProps = {
            ...this.internalProps,
            ...props,
        };

        if (props.events) {
            this.internalProps.events = props.events;
            this.eventManager.updateEventListeners(props.events);
        }
    }

    private getUpdatedAiChatPropsFromInternalProps(
        internalProps: AiChatInternalProps<AiMsg>,
    ): AiChatProps<AiMsg> {
        const updatedProps: AiChatProps<AiMsg> = {...internalProps};
        type AiChatPropsKey = keyof AiChatProps<AiMsg>;

        // We remove any undefined or null values from the props
        // or any empty objects
        for (const key of Object.keys(updatedProps) as AiChatPropsKey[]) {
            if (updatedProps[key] === undefined || updatedProps[key] === null || (
                typeof updatedProps[key] === 'object' && Object.keys(updatedProps[key] as any).length === 0
            )) {
                delete updatedProps[key];
            }
        }

        return updatedProps;
    };
}
