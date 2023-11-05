import {NluxExceptions} from '../../exceptions/exceptions';
import {Adapter} from '../../types/adapter';
import {NluxContext} from '../../types/context';
import {NluxProps} from '../../types/props';
import {warn} from '../../x/debug';
import {uid} from '../../x/uid';
import {NluxRenderer} from '../renderer/renderer';

export class NluxController<InboundPayload = any, OutboundPayload = any> {
    private readonly adapter: Adapter<InboundPayload, OutboundPayload>;
    private readonly nluxInstanceId = uid();
    private readonly rootCompId: string;
    private readonly rootElement: HTMLElement;

    private context: NluxContext | null = null;
    private props: NluxProps | null = null;

    private renderException = (exceptionId: string) => {
        if (!this.mounted || !this.renderer) {
            return null;
        }

        const exception = NluxExceptions[exceptionId as keyof typeof NluxExceptions];
        if (!exception) {
            warn(`Exception with id '${exceptionId}' is not defined`);
            return null;
        }

        this.renderer.renderEx(exception.type, exception.message, false);
    };

    private renderer: NluxRenderer<InboundPayload, OutboundPayload> | null = null;

    constructor(
        adapter: Adapter<InboundPayload, OutboundPayload>,
        rootElement: HTMLElement,
        props: NluxProps | null = null,
    ) {
        this.rootCompId = 'chat-room';
        this.adapter = adapter;
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

        const newContext: NluxContext = {
            instanceId: this.nluxInstanceId,
            exception: this.renderException,
            adapter: this.adapter,
        };

        this.context = Object.freeze(newContext);
        this.renderer = new NluxRenderer(
            newContext,
            this.rootCompId,
            this.rootElement,
            this.props,
        );

        this.renderer.mount();
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
        this.context = null;
    }

    public updateProps(props: NluxProps) {
        this.renderer?.updateProps(props);
    }
}
