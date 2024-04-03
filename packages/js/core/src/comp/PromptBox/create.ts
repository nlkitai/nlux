import {DomCreator} from '../../types/dom/DomCreator';
import {createLoaderDom} from '../Loader/create';
import {createSendIconDom} from '../SendIcon/create';
import {PromptBoxProps} from './props';
import {applyNewStatusClassName} from './utils/applyNewStatusClassName';

export const className = 'nlux_comp_prmpt_box';

export const createPromptBoxDom: DomCreator<PromptBoxProps> = (props) => {
    const element = document.createElement('div');
    element.classList.add(className);

    const textarea = document.createElement('textarea');
    textarea.placeholder = props.placeholder ?? '';
    textarea.value = props.message ?? '';

    const submitButton = document.createElement('button');
    submitButton.append(createSendIconDom());
    submitButton.append(createLoaderDom());

    element.append(textarea);
    element.append(submitButton);
    applyNewStatusClassName(element, props.status);

    if (props.status === 'submitting') {
        textarea.disabled = true;
        submitButton.disabled = true;
    }

    if (props.status === 'waiting') {
        submitButton.disabled = true;
    }

    return element;
};
