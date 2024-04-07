import {DomCreator} from '../../types/dom/DomCreator';
import {createLoaderDom} from '../Loader/create';
import {MessageProps, MessageStatus} from './props';
import {applyNewDirectionClassName} from './utils/applyNewDirectionClassName';
import {applyNewStatusClassName} from './utils/applyNewStatusClassName';
import {createMessageContent} from './utils/createMessageContent';

export const className = 'nlux_comp_msg';

export const createMessageDom: DomCreator<MessageProps> = (props): HTMLElement => {
    const element = document.createElement('div');
    element.classList.add(className);

    const status: MessageStatus = props.status ? props.status : 'rendered';
    applyNewStatusClassName(element, status);
    applyNewDirectionClassName(element, props.direction);

    if (status === 'streaming') {
        return element;
    }

    if (status === 'loading') {
        element.append(props.loader ?? createLoaderDom());
        return element;
    }

    if (status === 'error') {
        element.append(createMessageContent('Error'));
        return element;
    }

    //
    // Default status is — rendered
    //

    if (props.message) {
        element.append(createMessageContent(props.message));
    }

    return element;
};
