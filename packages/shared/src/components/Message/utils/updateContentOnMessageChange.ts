import {emptyInnerHtml} from '../../../utils/dom/emptyInnerHtml';
import {MessageProps} from '../props';
import {createMessageContent} from './createMessageContent';

export const updateContentOnMessageChange = (
    element: HTMLElement,
    propsBefore: MessageProps,
    propsAfter: MessageProps,
) => {
    if (
        propsBefore.message === propsAfter.message &&
        propsBefore.format === propsAfter.format
    ) {
        return;
    }

    emptyInnerHtml(element);
    element.append(
        createMessageContent(propsAfter.message ?? '', propsAfter.format, {
            htmlSanitizer: propsAfter.htmlSanitizer,
        }),
    );
};
