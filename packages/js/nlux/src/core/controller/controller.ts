import {Adapter} from '../../types/adapter';
import {NluxContext} from '../../types/context';
import {NluxProps} from '../../types/props.ts';
import {CompRegistry} from '../comp/registry';
import {NluxRenderingError} from '../error';
import {NluxRenderer} from '../renderer/renderer';

export class NluxController<InboundPayload = any, OutboundPayload = any> {
    private adapter: Adapter<InboundPayload, OutboundPayload>;
    private readonly context: NluxContext<InboundPayload, OutboundPayload>;
    private readonly renderer: NluxRenderer<InboundPayload, OutboundPayload>;

    constructor(
        adapter: Adapter<InboundPayload, OutboundPayload>,
        rootElement: HTMLElement,
        props?: NluxProps,
    ) {
        const rootComponentDef = CompRegistry.retrieve('chat-room');
        if (!rootComponentDef) {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Root component not registered',
            });
        }

        const RootCompClass = rootComponentDef.model as any;
        if (!RootCompClass || typeof RootCompClass !== 'function') {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Root component model is not a class',
            });
        }

        const newContext: NluxContext<InboundPayload, OutboundPayload> = {
            adapter,
        };

        this.context = Object.freeze(newContext);
        this.adapter = adapter;
        this.renderer = new NluxRenderer(
            newContext,
            RootCompClass,
            rootElement,
            props,
        );
    }

    public get mounted() {
        return this.renderer.mounted;
    }

    public hide() {
        if (!this.mounted) {
            return;
        }

        this.renderer.hide();
    }

    public mount() {
        if (this.mounted) {
            return;
        }

        this.renderer.mount();
    }

    public show() {
        if (!this.mounted) {
            return;
        }

        this.renderer.show();
    }

    public unmount() {
        if (!this.mounted) {
            return;
        }

        this.renderer.unmount();
    }

    public updateProps(props: NluxProps) {
        this.renderer.updateProps(props);
    }
}
