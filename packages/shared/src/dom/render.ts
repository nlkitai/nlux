import {debug} from '../utils/debug';
import {warn} from '../utils/warn';

export const render = (html: string): DocumentFragment | HTMLElement | undefined => {
    debug(html);

    const template = document.createElement('div');
    template.innerHTML = html.trim();

    const fragment = document.createDocumentFragment();
    while (template.firstChild) {
        fragment.append(template.firstChild);
    }

    if (!fragment.firstChild) {
        return;
    }

    // Make sure that all elements included in the fragment are HTMLElements
    // Example: <!-- comments --> elements are not HTMLElements
    for (let i = 0; i < fragment.children.length; i++) {
        const child = fragment.children[i];
        if (!(child instanceof HTMLElement)) {
            warn('render() function rendered a non HTMLElement');
            return;
        }
    }

    if (fragment.children.length === 1) {
        return fragment.children[0] as HTMLElement;
    }

    return fragment;
};
