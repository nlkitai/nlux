import {DomCreator} from '../../types/dom/DomCreator';
import {MessageProps, MessageStatus} from './props';
import {applyNewDirectionClassName} from './utils/applyNewDirectionClassName';
import {applyNewStatusClassName} from './utils/applyNewStatusClassName';
import {createMessageContent} from './utils/createMessageContent';

export const className = 'nlux-comp-message';

export const createMessageDom: DomCreator<MessageProps> = (props): HTMLElement => {
    const element = document.createElement('div');
    element.classList.add(className);

    const status: MessageStatus = props.status ? props.status : 'complete';
    applyNewStatusClassName(element, status);
    applyNewDirectionClassName(element, props.direction);

    if (status === 'streaming') {
        return element;
    }

    //
    // Default status is — rendered
    //

    if (props.message) {
        element.append(createMessageContent(props.message, props.format, {
            htmlSanitizer: props.htmlSanitizer,
        }));
    }

    return element;
};
