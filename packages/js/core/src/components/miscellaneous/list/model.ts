import {BaseComp} from '../../../core/comp/base';
import {Model} from '../../../core/comp/decorators';
import {NluxError} from '../../../core/error';
import {NluxContext} from '../../../types/context';
import {domOp} from '../../../x/domOp';
import {renderList} from './render';
import {CompListElements, CompListEvents, CompListProps} from './types';
import {updateList} from './update';

type ItemToRender<CompType> = {
    component: CompType;
    containerCssClass?: string;
}

@Model('list', renderList, updateList)
export class CompList<CompType extends BaseComp<any, any, any, any>>
    extends BaseComp<CompListProps, CompListElements, CompListEvents, any> {

    private componentsById: Map<string, CompType> = new Map();
    private componentsToRender: Array<ItemToRender<CompType>> = [];
    private renderedComponents: Array<CompType> = [];

    constructor(context: NluxContext, props: CompListProps) {
        super(context, props);
    }

    public get size() {
        return this.renderedComponents.length;
    }

    public appendComponent(
        componentToAppend: CompType,
        containerCssClass?: string,
    ) {
        if (componentToAppend.destroyed) {
            throw new NluxError({
                source: this.constructor.name,
                message: `Unable to append component "${componentToAppend.id}" because it is already destroyed`,
            });
        }

        if (componentToAppend.rendered) {
            throw new NluxError({
                source: this.constructor.name,
                message: `Unable to append component "${componentToAppend.id}" because it is already rendered`,
            });
        }

        if (this.componentsById.has(componentToAppend.id)) {
            throw new NluxError({
                source: this.constructor.name,
                message: `Unable to append component "${componentToAppend.id}" because it a component `
                    + `with the same id is already appended`,
            });
        }

        if (this.renderedComponents.includes(componentToAppend)) {
            throw new NluxError({
                source: this.constructor.name,
                message: `Unable to append component "${componentToAppend.id}" because it is already appended`,
            });
        }

        if (!this.renderingRoot) {
            throw new NluxError({
                source: this.constructor.name,
                message: `Unable to append component "${componentToAppend.id}" because rendering root is not set`,
            });
        }

        // List not rendered yet - add component to list of components to render
        // when the list is rendered.
        if (!this.rendered) {
            this.componentsToRender.push({
                component: componentToAppend,
                containerCssClass,
            });

            this.componentsById.set(componentToAppend.id, componentToAppend);
            return;
        }

        // List is rendered - append component to list of rendered components and render it.
        this.renderedComponents.push(componentToAppend);

        domOp(() => {
            if (!this.renderingRoot) {
                return;
            }

            //
            // Create container and append list item
            //

            const itemContainer = document.createElement('div');
            if (containerCssClass) {
                itemContainer.className = containerCssClass;
            }

            componentToAppend.render(itemContainer);
            this.renderingRoot.append(itemContainer);
        });
    }

    public forEachComponent(callback: (component: CompType, index: number) => void) {
        this.renderedComponents.forEach(callback);
    }

    public getComponentAt(index: number): CompType | undefined {
        if (index < 0 || index >= this.renderedComponents.length) {
            return;
        }

        return this.renderedComponents[index];
    }

    public getComponentById(id: string): CompType | undefined {
        for (const component of this.renderedComponents) {
            if (component.id === id) {
                return component;
            }
        }
    }

    public removeComponent(component: BaseComp<any, any, any, any>) {
        for (let i = 0; i < this.renderedComponents.length; i++) {
            if (this.renderedComponents[i] === component) {
                this.removeComponentAt(i);
                return;
            }
        }
    }

    public removeComponentAt(index: number) {
        if (index < 0 || index >= this.renderedComponents.length) {
            return;
        }

        const victim = this.renderedComponents[index];
        victim.destroyListItemComponent();

        this.renderedComponents.splice(index, 1);
    }

    public removeComponentById(id: string) {
        for (let i = 0; i < this.renderedComponents.length; i++) {
            if (this.renderedComponents[i].id === id) {
                this.removeComponentAt(i);
                return;
            }
        }
    }

    public render(root: HTMLElement) {
        this.throwIfDestroyed();

        if (!this.def) {
            return null;
        }

        if (!this.renderedDom) {
            const compId = Object.getPrototypeOf(this).constructor.__compId;
            const renderedDom = this.executeRenderer(root);
            if (!renderedDom) {
                throw new NluxError({
                    source: this.constructor.name,
                    message: `Unable to render list component "${compId}" because renderer returned null`,
                });
            }

            this.renderedDom = renderedDom;
        }

        if (this.componentsToRender.length > 0) {
            if (!(root instanceof HTMLElement)) {
                throw new NluxError({
                    source: this.constructor.name,
                    message: 'Unable to render list component because root is not an HTMLElement',
                });
            }

            this.renderingRoot = root;

            for (const item of this.componentsToRender) {
                const {component, containerCssClass} = item;

                //
                // Create container and append list item
                //

                const itemContainer = document.createElement('div');
                if (containerCssClass) {
                    itemContainer.className = containerCssClass;
                }

                component.render(itemContainer);
                root.append(itemContainer);

                this.renderedComponents.push(component);
            }

            this.componentsToRender = [];
        }
    }
}
