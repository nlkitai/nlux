import {CallbackArgType, CallbackFunction} from '../../../../../../shared/src/types/callbackFunction';
import {NluxError, NluxUsageError} from '../../../../../../shared/src/types/error';
import {domOp} from '../../../../../../shared/src/utils/dom/domOp';
import {uid} from '../../../../../../shared/src/utils/uid';
import {warn} from '../../../../../../shared/src/utils/warn';
import {CompDef, CompDom, CompRenderer, CompUpdater} from '../../../types/comp';
import {ControllerContext} from '../../../types/controllerContext';
import {CompRegistry} from './registry';

export type CompStatus = 'unmounted' | 'rendered' | 'active' | 'destroyed';

export abstract class BaseComp<AiMsg, PropsType, ElementsType, EventsType, ActionsType> {
    static __compEventListeners: Map<string | number | symbol, string[]> | null = null;
    static __compId: string | null = null;
    static __renderer: CompRenderer<unknown, unknown, unknown, unknown> | null = null;
    static __updater: CompUpdater<unknown, unknown, unknown> | null = null;

    /**
     * A reference to the component definition, as retrieved from the registry.
     */
    protected readonly def: CompDef<PropsType, ElementsType, EventsType, ActionsType> | null;

    /**
     * Props that are used to render the component and update the DOM tree.
     * This map is constructed from the props provided by the user, but it can be modified by
     * the component using the setProp() method.
     */
    protected elementProps: Map<keyof PropsType, PropsType[keyof PropsType]>;

    /**
     * Props that are provided by the component user.
     */
    protected props: Readonly<PropsType>;

    /**
     * A reference to the DOM tree of the current component, and a callback that is called when the
     * component is destroyed.
     */
    protected renderedDom: CompDom<ElementsType, ActionsType> | null;

    /**
     * Internally used event listeners that are registerer by the renderer.
     * Those events are mounted on the DOM tree of the component by the renderer.
     * This map can be used by components that extend the BaseComp to register listeners.
     */
    protected rendererEventListeners: Map<EventsType, () => void>;

    /**
     * Props that are passed to the renderer.
     * This map is constructed from the props provided by the user.
     */
    protected rendererProps: PropsType;

    /**
     * A reference to the root element of the current component.
     * This could be an HTML element (for most of the cases when the component is rendered in the DOM tree)
     * or it could be a document fragment (for cases when the component is rendered in a virtual DOM tree).
     * This property is set to null when the component is not rendered.
     */
    protected renderingRoot: HTMLElement | DocumentFragment | null;

    /**
     * Element IDs of the sub-components that are mounted in the DOM tree of the current component.
     * The key is the ID of the sub-component and the value is the ID of the element in the DOM tree.
     */
    protected subComponentElementIds: Map<string, keyof ElementsType> = new Map();

    /**
     * Sub-components that are mounted in the DOM tree of the current component.
     * This list should be filled by user by calling addPart() method in constructor of the component.
     */
    protected subComponents: Map<string, BaseComp<unknown, unknown, unknown, unknown, unknown>> = new Map();

    /**
     * The context of the current chat component.
     */
    private __context: Readonly<ControllerContext<AiMsg>> | null = null;

    /**
     * A flag that indicates if the current component is destroyed.
     * This will prevent the component from being rendered, updated, or used in any way.
     */
    private __destroyed: boolean = false;

    /**
     * A unique identifier of the current component instance.
     */
    private readonly __instanceId: string;

    /**
     * The status of the current component.
     */
    private __status: CompStatus = 'unmounted';

    /**
     * A queue of actions that should be executed on the DOM tree when the component is rendered.
     * This queue is used to store actions that are called before the component is rendered.
     */
    private actionsOnDomReady: (() => void)[] = [];

    private compEventGetter = (eventName: EventsType) => {
        if (this.destroyed) {
            // Ignore event calls on destroyed components
            return () => {
            };
        }

        const callback = this.rendererEventListeners.get(eventName as EventsType);
        if (!callback) {
            throw new NluxError({
                source: this.constructor.name,
                message: `Unable to call renderer event "${eventName}" because no matching event listener was found. ` +
                    `Make sure that the event listener is registered using @CompEventListener() decorator ` +
                    `in the component model class, and use class methods instead of arrow function attributes.`,
            });
        }

        return callback;
    };

    protected constructor(context: ControllerContext<AiMsg>, props: PropsType) {
        const compId = Object.getPrototypeOf(this).constructor.__compId;
        if (!compId) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to instantiate component: missing compId in implementation. ' +
                    'Component should be annotated using @Model() to set compId ' +
                    'before iy can be instantiated.',
            });
        }

        this.def = CompRegistry.retrieve(compId) ?? null;
        if (!this.def) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: `Unable to instantiate component "${compId}" because it\'s not registered. ` +
                    'Component should be registered using CompRegistry.register(ComponentClass) ' +
                    'before instantiating a component.',
            });
        }

        this.__instanceId = uid();
        this.__destroyed = false;
        this.__context = context;

        this.renderedDom = null;
        this.renderingRoot = null;

        this.props = props;
        this.elementProps = new Map(props ? Object.entries(props) as any : []);
        this.rendererEventListeners = new Map();

        const preDefinedEventListeners: Map<string, string[]> | null = (<any>this.constructor).__compEventListeners;
        if (preDefinedEventListeners) {
            preDefinedEventListeners.forEach((methodNames, eventName) => {
                methodNames.forEach((methodName) => {
                    const method = (Object.getPrototypeOf(this))[methodName];
                    if (typeof method === 'function') {
                        this.addRendererEventListener(eventName as EventsType, method.bind(this));
                    } else {
                        warn(`Unable to set event listener "${eventName}" because method "${methodName}" ` +
                            `cannot be found on component "${this.constructor.name} at runtime!"`);
                    }
                });
            });
        }

        this.rendererProps = Object.freeze(props) as PropsType;
    }

    public get destroyed(): boolean {
        return this.__destroyed;
    }

    public get id(): string {
        return this.__instanceId;
    }

    public get rendered(): boolean {
        return this.renderedDom !== null;
    }

    public get root(): HTMLElement | DocumentFragment | null {
        this.throwIfDestroyed();

        if (!this.renderedDom || !this.renderingRoot) {
            return null;
        }

        return this.renderingRoot;
    }

    public get status(): CompStatus {
        return this.__status;
    }

    protected get context(): Readonly<ControllerContext<AiMsg>> {
        if (!this.__context) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to get context because it\'s not set',
            });
        }

        return this.__context;
    }

    public destroy() {
        this.destroyComponent();
    }

    public destroyListItemComponent() {
        this.destroyComponent(true);
    }

    public getProp(name: keyof PropsType): PropsType[keyof PropsType] | null {
        this.throwIfDestroyed();
        return this.elementProps.get(name) ?? null;
    }

    /**
     * Renders the current component in the DOM tree.
     * This method should be called by the component user to render the component. It should only be called once.
     * If the user attempts to render a mounted or destroyed component, an error will be thrown.
     *
     * You can use rendered property to check if the component is rendered before/after calling render().
     * You can use destroyed property to check if the component is already destroyed before calling render().
     *
     * @param root The root element where the component should be rendered.
     * @param insertBeforeElement The element before which the component should be inserted. If not provided, the
     * component will be appended to the root element. If provided, the component will be inserted before the
     * provided element if it exists in the root element.
     */
    public render(root: HTMLElement, insertBeforeElement?: HTMLElement) {
        if (!this.def) {
            return;
        }

        if (this.destroyed) {
            warn(`Unable to render component "${this.def?.id}" because it is already destroyed`);
            return;
        }

        if (this.rendered || this.renderedDom) {
            warn(`Unable to render component "${this.def.id}" because it is already rendered`);
            return;
        }

        // IMPORTANT: This is where rendering happens!
        // We initially render the component in a virtual root element (document fragment)
        // Then we render the sub-components in their respective portals
        // Then we append the virtual root element to the actual root element

        const virtualRoot = document.createDocumentFragment();
        const compId = Object.getPrototypeOf(this).constructor.__compId;
        const renderedDom = this.executeRenderer(virtualRoot);
        if (!renderedDom) {
            throw new NluxError({
                source: this.constructor.name,
                message: `Unable to render component "${compId}" because renderer returned null`,
            });
        }

        this.renderedDom = renderedDom;

        // We render sub-components in their respective portals
        for (const [, subComponent] of this.subComponents) {
            const portal = this.getSubComponentPortal(subComponent.id);
            if (portal) {
                this.mountSubComponentToPortal(subComponent.id, portal);
            }
        }

        // We append the virtual root element to the actual root element
        domOp(() => {
            if (this.destroyed) {
                return;
            }

            if (insertBeforeElement) {
                root.insertBefore(virtualRoot, insertBeforeElement);
            } else {
                root.append(virtualRoot);
            }

            this.renderingRoot = root;
        });
    }

    updateSubComponent(subComponentId: string, propName: string, newValue: unknown) {
        this.throwIfDestroyed();

        const subComp = this.subComponents.get(subComponentId) as BaseComp<
            AiMsg, PropsType, ElementsType, EventsType, ActionsType
        > | undefined;

        if (subComp && !subComp.destroyed) {
            subComp.setProp(propName as keyof PropsType, newValue as PropsType[keyof PropsType]);
        }
    }

    protected addSubComponent<SubCompPropsType, SubCompElementsType, SubCompEventsType, SubCompActionsType>(
        id: string,
        subComponent: BaseComp<AiMsg, SubCompPropsType, SubCompElementsType, SubCompEventsType, SubCompActionsType>,
        rendererElementId?: keyof ElementsType,
    ) {
        this.throwIfDestroyed();

        if (this.subComponents.has(id)) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: `Unable to add sub-component "${id}" because it already exists`,
            });
        }

        this.subComponents.set(id, subComponent as BaseComp<unknown, unknown, unknown, unknown, unknown>);

        if (rendererElementId) {
            this.subComponentElementIds.set(id, rendererElementId);
        }

        if (this.renderedDom) {
            const portal = this.getSubComponentPortal(id);
            if (portal) {
                this.mountSubComponentToPortal(id, portal);
            }
        }
    }

    /**
     * Executes a DOM action on the current component.
     * DOM actions are defined by the renderer and are used to call DOM-defined functions.
     * DOM actions should not be used to update the DOM tree. Use setProp() to update the DOM tree.
     *
     * Example of DOM actions: Focus on an input, scroll to a specific element, select text.
     *
     * @param actionName
     * @param args
     * @protected
     */
    protected executeDomAction(actionName: keyof ActionsType, ...args: Array<unknown>) {
        this.throwIfDestroyed();

        if (!this.renderedDom) {
            this.actionsOnDomReady.push(() => this.executeDomAction(actionName, ...args));
            return;
        }

        if (!this.renderingRoot) {
            throw new NluxError({
                source: this.constructor.name,
                message: 'Unable to execute DOM action because renderingRoot is not set',
            });
        }

        // Execute the action
        const action = (<ActionsType>this.renderedDom.actions)[actionName];
        if (!action) {
            throw new NluxError({
                source: this.constructor.name,
                message: `Unable to execute DOM action "${String(actionName)}" because it does not exist`,
            });
        }

        return domOp(() => (action as CallbackFunction)(...args as CallbackArgType[]));
    };

    protected executeRenderer(root: HTMLElement | DocumentFragment) {
        const renderer = this.def?.render;
        if (!renderer) {
            return null;
        }

        if (this.renderingRoot) {
            throw new NluxError({
                source: this.constructor.name,
                message: 'Unable to render component because renderingRoot is already set',
            });
        }

        const result = renderer({
            appendToRoot: (element: HTMLElement) => {
                root.append(element);
                // Run pending DOM actions that were queued before the component was rendered
                this.runDomActionsQueue();
            },
            compEvent: this.compEventGetter,
            props: this.rendererProps,
            context: this.context as ControllerContext<unknown>,
        });

        if (result) {
            // Only keep a reference to the root element of the component on successful rendering.
            this.renderingRoot = root;
        }

        return result;
    }

    protected removeSubComponent(id: string) {
        this.throwIfDestroyed();

        domOp(() => {
            const subComp = this.subComponents.get(id);
            if (subComp) {
                // Change sub-component root before deleting it to avoid deleting the root element
                subComp.renderingRoot = null;
                subComp.destroy();
                this.subComponents.delete(id);
            }
        });
    }

    protected runDomActionsQueue() {
        if (this.actionsOnDomReady.length > 0 && this.rendered) {
            const actionsOnDomReady = this.actionsOnDomReady;
            this.actionsOnDomReady = [];
            for (const action of actionsOnDomReady) {
                domOp(() => action());
            }
        }
    }

    /**
     * Sets a property of the current component.
     * This method can be called by the component to change property values.
     * New values will be passed to updater function to update the DOM tree.
     *
     * @param name
     * @param value
     * @protected
     */
    protected setProp(name: keyof PropsType, value: PropsType[keyof PropsType]) {
        if (this.destroyed) {
            warn(`Unable to set prop "${String(name)}" because component "${this.constructor.name}" is destroyed`);
            return;
        }

        if (!this.elementProps.has(name)) {
            warn(`Unable to set prop "${String(name)}" because it does not exist in the component props`);
            return;
        }

        this.schedulePropUpdate(
            name,
            this.elementProps.get(name)!,
            value,
        );

        this.props = Object.freeze(Object.fromEntries(this.elementProps)) as Readonly<PropsType>;
        this.elementProps.set(name, value);
    }

    protected throwIfDestroyed() {
        if (this.__destroyed) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: 'Unable to call method on destroyed component',
            });
        }
    }

    private addRendererEventListener(eventType: EventsType, listener: () => void) {
        this.throwIfDestroyed();

        if (this.rendererEventListeners.has(eventType)) {
            throw new NluxUsageError({
                source: this.constructor.name,
                message: `Unable to add event listener to rendererEvents "${eventType}" because it already exists`,
            });
        }

        this.rendererEventListeners.set(eventType, listener);
    };

    private destroyComponent(isListItem = false) {
        this.throwIfDestroyed();

        this.subComponents.forEach((subComp) => {
            subComp.destroy();
        });

        if (this.renderedDom) {
            if (this.renderedDom.elements) {
                this.renderedDom.elements = undefined;
            }

            if (this.renderedDom.actions) {
                this.renderedDom.actions = undefined;
            }

            if (this.renderedDom.onDestroy) {
                this.renderedDom.onDestroy();
            }

            // IMPORTANT:
            // Clean up removed DOM elements asynchronously
            const renderingRoot = this.renderingRoot;
            domOp(() => {
                if (!renderingRoot) {
                    return;
                }

                if (renderingRoot instanceof DocumentFragment) {
                    while (renderingRoot.firstChild) {
                        renderingRoot.removeChild(renderingRoot.firstChild);
                    }
                } else {
                    if (isListItem) {
                        renderingRoot.parentElement?.removeChild(renderingRoot);
                    } else {
                        renderingRoot.innerHTML = '';
                    }
                }
            });

            this.renderedDom = null;
            this.renderingRoot = null;
        }

        this.__destroyed = true;
        this.__context = null;
        this.props = undefined as PropsType;

        this.elementProps.clear();
        this.rendererEventListeners.clear();
        this.subComponents.clear();
    }

    private getSubComponentPortal(id: string): HTMLElement | null {
        const subComp = this.subComponents.get(id);
        const rendererElementId = this.subComponentElementIds.get(id);

        if (!subComp || !rendererElementId) {
            return null;
        }

        const value = (<ElementsType>this.renderedDom?.elements)[rendererElementId];
        return value instanceof HTMLElement ? value : null;
    }

    private mountSubComponentToPortal(subComponentId: string, portal: HTMLElement) {
        const subComp = this.subComponents.get(subComponentId);
        subComp?.render(portal);
    }

    private schedulePropUpdate(
        propName: keyof PropsType,
        currentValue: PropsType[keyof PropsType],
        newValue: PropsType[keyof PropsType],
    ) {
        if (!this.renderedDom || !this.def?.update) {
            return;
        }

        const renderedDom = this.renderedDom;
        const renderingRoot = this.renderingRoot;
        const updater = this.def.update;

        if (!renderingRoot) {
            return;
        }

        domOp(() => {
            updater({
                propName,
                currentValue,
                newValue,
                dom: {
                    root: renderingRoot,
                    elements: renderedDom.elements,
                    actions: renderedDom.actions,
                },
                updateSubComponent: this.updateSubComponent,
            });
        });
    }
}
