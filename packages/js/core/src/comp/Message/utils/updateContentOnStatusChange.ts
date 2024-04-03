import {createLoaderDom} from '../../Loader/create';
import {MessageProps} from '../props';

export const updateContentOnStatusChange = (
    element: HTMLElement,
    propsBefore: MessageProps,
    propsAfter: MessageProps,
) => {
    const newStatus = propsAfter.status;
    const loader = propsAfter.loader;

    if (newStatus === 'loading') {
        if (element.hasChildNodes()) {
            element.replaceChildren();
        }

        if (loader) {
            element.append(loader);
        } else {
            element.append(createLoaderDom());
        }

        return;
    }

    if (propsBefore.status === 'loading' && element.hasChildNodes()) {
        element.replaceChildren();
    }

    if (newStatus === 'streaming') {
        return;
    }

    if (newStatus === 'rendered') {
        const innerHtml = propsAfter.message ? propsAfter.message : '';
        const textNode = document.createTextNode(innerHtml);
        element.classList.add('nlux_msg_rendered');
        element.replaceChildren();
        element.append(textNode);

        return;
    }
};
