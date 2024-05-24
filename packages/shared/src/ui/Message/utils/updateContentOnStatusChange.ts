import {emptyInnerHtml} from '../../../utils/dom/emptyInnerHtml';
import {MessageProps} from '../props';
import {statusClassName} from './applyNewStatusClassName';

export const updateContentOnStatusChange = (
    element: HTMLElement,
    propsBefore: MessageProps,
    propsAfter: MessageProps,
) => {
    const newStatus = propsAfter.status;
    if (newStatus === 'streaming') {
        return;
    }

    if (newStatus === 'complete') {
        const innerHtml = propsAfter.message ? propsAfter.message : '';
        const textNode = document.createTextNode(innerHtml);
        element.classList.add(statusClassName[newStatus]);
        emptyInnerHtml(element);
        element.append(textNode);

        return;
    }
};
