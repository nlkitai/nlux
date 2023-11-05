import {BaseComp} from '../core/comp/base';

/**
 * This interface represents a component that is mounted in the DOM tree.
 * It contains a map of elements that are mounted in the DOM tree and can be accessed by parent components: `elements`.
 * It also contains a map of actions that depend on DOM elements `actions` (such as focus, set active, etc.).
 * The `onDestroy` callback is called when the component is destroyed, and should be used to clean up any resources.
 *
 * Please note: The `elements` map does not include all elements that are mounted in the DOM tree, but only those
 * that are explicitly added to the map by the renderer. Those elements are usually used by parent component
 * to mount subcomponents, or by the updater function to update the DOM tree when a prop changes.
 */
export type CompDom<ElementsType, ActionsType> = {
    elements?: ElementsType;
    actions?: ActionsType;
    onDestroy?: () => void;
};

/**
 * This interface represents a rendering function that is used to render a component.
 * It receives a `appendToRoot` function that can be called to append elements to the parent DOM tree.
 * It also receives a `compEvent` function that can be called to obtain a callback function that can be used
 * to emit events to the parent component. The component's `props` are passed as a parameter to the rendering function.
 * The rendering function should return a `CompDom` object.
 */
export type CompRenderer<PropsType, ElementsType, EventsType, ActionsType = undefined> = (params: {
    appendToRoot: (element: HTMLElement) => void,
    compEvent: (eventName: EventsType) => Function,
    props: Readonly<PropsType>,
}) => CompDom<ElementsType, ActionsType>;

/**
 * This interface represents an update function that is used to update a component.
 * It receives `propName` - the name of the prop that has changed, `newValue` - the new value of the prop,
 * `dom.root` - the root element of the component, `dom.elements` - the elements map of the component, and
 * `dom.actions` - list of actions that can be executed on the component's DOM elements.
 */
export type CompUpdater<PropsType, ElementsType, ActionsType> = (params: {
    propName: keyof PropsType,
    newValue: PropsType[keyof PropsType] | undefined | null,
    dom: {
        root: HTMLElement | DocumentFragment,
        elements?: ElementsType,
        actions?: ActionsType,
    },
    updateSubComponent?: (partId: string, propName: string, newValue: any) => void,
}) => void;

/**
 * This interface represents a component definition as it's stored in the component registry.
 * It's a combination of the important items that are needed to render and update a component:
 * `id` - the unique identifier of the component, `model` - the component's model, `render` - the rendering function,
 * and `update` - the update function.
 */
export type CompDef<PropsType, ElementsType, EventsType, ActionsType> = {
    readonly id: string;
    readonly model: typeof BaseComp;
    readonly render: CompRenderer<PropsType, ElementsType, EventsType, ActionsType>;
    readonly update: CompUpdater<PropsType, ElementsType, ActionsType>;
};
