import {registerAllComponents} from '../components/registerAll';
import {Adapter} from '../types/adapter';
import {AdapterBuilder} from '../types/adapterBuilder';
import {NluxProps} from '../types/props.ts';
import {debug} from '../x/debug';
import {ExposedConfig} from './config';
import {NluxController} from './controller/controller';
import {NluxRenderingError, NluxUsageError, NluxValidationError} from './error';
import {IConvoPit} from './interface';
import {ConversationOptions} from './options/conversationOptions.ts';
import {MessageOptions} from './options/messageOptions.ts';
import {PromptBoxOptions} from './options/promptBoxOptions.ts';

export class ConvoPit implements IConvoPit {
    protected exposedConfig: ExposedConfig = {
        adapter: null,
        theme: null,
        containerMaxHeight: null,
        promptPlaceholder: null,
    };

    protected theAdapter: Adapter<any, any> | null = null;
    protected theContainerMaxHeight: number | null = null;
    protected theConversationOptions: ConversationOptions | null = null;
    protected theMessageOptions: MessageOptions | null = null;
    protected thePromptBoxOptions: PromptBoxOptions | null = null;
    protected theTheme: string | null = null;
    private componentsRegistered: boolean = false;
    private controller: NluxController | null = null;

    public get config(): ExposedConfig {
        return this.exposedConfig;
    }

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

        if (!this.componentsRegistered) {
            registerAllComponents();
            this.componentsRegistered = true;
        }

        rootElement.innerHTML = '';
        const controller = new NluxController(
            this.theAdapter,
            rootElement,
            {
                themeId: this.theTheme ?? undefined,
                containerMaxHeight: this.theContainerMaxHeight ?? undefined,
                promptBoxOptions: this.thePromptBoxOptions ?? undefined,
                messageOptions: this.theMessageOptions ?? undefined,
                conversationOptions: this.theConversationOptions ?? undefined,
            },
        );
        controller.mount();

        if (controller.mounted) {
            this.controller = controller;
        } else {
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Root component did not render.',
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
            throw new NluxRenderingError({
                source: this.constructor.name,
                message: 'Unable to unmount. NLUX is not mounted.',
            });
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

    public updateProps(props: Partial<NluxProps>) {
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

        const adapter = adapterBuilder.create();

        this.theAdapter = adapter;
        this.exposedConfig = {
            ...this.exposedConfig,
            adapter: adapter.constructor.name,
        };

        return this;
    };

    withContainerMaxHeight(containerMaxHeight: number) {
        if (this.mounted) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set container max height. NLUX is already mounted.',
            });
        }

        if (this.theContainerMaxHeight !== null) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to change config. A container max height was already set.',
            });
        }

        this.theContainerMaxHeight = containerMaxHeight;
        this.exposedConfig = {
            ...this.exposedConfig,
            containerMaxHeight,
        };

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

    public withMessageOptions(messageOptions: MessageOptions) {
        if (this.mounted) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set message options. NLUX is already mounted.',
            });
        }

        if (this.theMessageOptions) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to change config. Message options were already set.',
            });
        }

        this.theMessageOptions = messageOptions;
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

    public withTheme(theme: string) {
        if (this.mounted) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to set theme. NLUX is already mounted.',
            });
        }

        if (this.theTheme) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to change config. A theme was already set.',
            });
        }

        this.theTheme = theme;
        this.exposedConfig = {
            ...this.exposedConfig,
            theme,
        };

        return this;
    }
}
