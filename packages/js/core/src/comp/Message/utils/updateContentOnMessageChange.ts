import {MessageProps} from '../props';
import {createMessageContent} from './createMessageContent';

export const updateContentOnMessageChange = (
    element: HTMLElement,
    propsBefore: MessageProps,
    propsAfter: MessageProps,
) => {
    if (propsBefore.message === propsAfter.message) {
        return;
    }

    element.replaceChildren();
    element.append(createMessageContent(propsAfter.message ?? ''));
};
