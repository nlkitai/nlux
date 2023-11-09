import {registerAllComponents} from '../components/components';
import {Adapter} from '../types/adapter';
import {AdapterBuilder} from '../types/adapterBuilder';
import {NluxProps} from '../types/props';
import {debug, warn} from '../x/debug';
import {NluxController} from './controller/controller';
import {NluxRenderingError, NluxUsageError, NluxValidationError} from './error';
import {INluxConvo} from './interface';
import {ConversationOptions} from './options/conversationOptions';
import {LayoutOptions} from './options/layoutOptions';
import {PromptBoxOptions} from './options/promptBoxOptions';

export class NluxConvo implements INluxConvo {
    protected theAdapter: Adapter<any, any> | null = null;
    protected theClassName: string | null = null;
    protected theConversationOptions: ConversationOptions | null = null;
    protected theLayoutOptions: LayoutOptions | null = null;
    protected thePromptBoxOptions: PromptBoxOptions | null = null;
    private controller: NluxController | null = null;

    public get mounted(): boolean {
        return this.controller?.mounted ?? false;
    }

    hide() {
        if (!this.controller) {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Unable to hide. NLUX is not mounted.',
            });
        }

        this.controller.hide();
    }

    public mount(rootElement: HTMLElement) {
        if (this.mounted) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to create NLUX instance. NLUX is already mounted. '
                    + 'Make sure to call `unmount()` before mounting again.',
            });
        }

        if (!this.theAdapter) {
            throw new NluxValidationError({
                source: this.constructor.name,
                message: 'Unable to create NLUX instance. Adapter is not set. '
                    + 'You should call `withAdapter(Adapter)` method before mounting NLUX.',
            });
        }

        registerAllComponents();

        rootElement.innerHTML = '';
        const controller = new NluxController(
            this.theAdapter,
            rootElement,
            {
                themeId: 'kensington', // Hardcoded for now - TODO: Make configurable
                className: this.theClassName ?? undefined,
                layoutOptions: this.theLayoutOptions ?? {},
                promptBoxOptions: this.thePromptBoxOptions ?? {},
                conversationOptions: this.theConversationOptions ?? {},
            },
        );

        controller.mount();

        if (controller.mounted) {
            this.controller = controller;
        } else {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'NluxConvo root component did not render.',
            });
        }
    };

    show() {
        if (!this.controller) {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Unable to show. NLUX is not mounted.',
            });
        }

        this.controller.show();
    }

    public unmount() {
        debug('Unmounting NLUX.');

        if (!this.controller) {
            warn('Invalid call to nluxConvo.unmount() on an already unmounted NLUX instance!');
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
    }

    public updateProps(props: NluxProps) {
        if (!this.controller) {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Unable to update props. NLUX is not mounted.',
            });
        }

        this.controller.updateProps(props);
    }

    public withAdapter(adapterBuilder: AdapterBuilder<any, any>) {
        if (this.mounted) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set adapter. NLUX is already mounted.',
            });
        }

        if (this.theAdapter) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to change config. A adapter was already set.',
            });
        }

        this.theAdapter = adapterBuilder.create();
        return this;
    };

    public withClassName(className: string) {
        if (this.mounted) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set class name. NLUX is already mounted.',
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
                message: 'Unable to set conversation options. NLUX is already mounted.',
            });
        }

        if (this.theConversationOptions) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to change config. Conversation options were already set.',
            });
        }

        this.theConversationOptions = conversationOptions;
        return this;
    }

    withLayoutOptions(layoutOptions: LayoutOptions) {
        if (this.mounted) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set layout options. NLUX is already mounted.',
            });
        }

        if (this.theLayoutOptions) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to change config. Layout options were already set.',
            });
        }

        this.theLayoutOptions = layoutOptions;

        return this;
    }

    public withPromptBoxOptions(promptBoxOptions: PromptBoxOptions) {
        if (this.mounted) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set prompt box options. NLUX is already mounted.',
            });
        }

        if (this.thePromptBoxOptions) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to change config. Prompt box options were already set.',
            });
        }

        this.thePromptBoxOptions = promptBoxOptions;
        return this;
    }
}
