import {DomCreator} from '../../types/dom/DomCreator';
import {createLoaderDom} from '../Loader/create';
import {createSendIconDom} from '../SendIcon/create';
import {ComposerProps} from './props';
import {applyNewStatusClassName} from './utils/applyNewStatusClassName';

export const className = 'nlux-comp-composer';

export const createComposerDom: DomCreator<ComposerProps> = (props) => {
    const element = document.createElement('div');
    element.classList.add(className);

    const textarea = document.createElement('div');
    textarea.contentEditable="true"

    textarea.setAttribute("data-placeholder",props.placeholder ?? '')
    textarea.innerText = props.message ?? '';

    if (props.autoFocus) {
        textarea.autofocus = true;
    }

    const submitButton = document.createElement('button');
    submitButton.append(createSendIconDom());
    submitButton.append(createLoaderDom());

    element.append(textarea);
    element.append(submitButton);
    applyNewStatusClassName(element, props.status);

    if (props.status === 'submitting-conversation-starter' || props.status === 'submitting-prompt') {
        textarea.contentEditable = "false";
        submitButton.disabled = true;
    }

    if (props.status === 'waiting') {
        submitButton.disabled = true;
    }

    if (props.status === 'typing') {
        submitButton.disabled = props.disableSubmitButton ?? textarea.innerText === '';
    }

    return element;
};
