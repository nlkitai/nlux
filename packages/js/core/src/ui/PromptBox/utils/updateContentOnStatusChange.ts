import {PromptBoxProps} from '../props';

export const updateContentOnStatusChange = (
    element: HTMLElement,
    propsBefore: PromptBoxProps,
    propsAfter: PromptBoxProps,
) => {
    if (propsBefore.status === propsAfter.status) {
        return;
    }

    const textArea: HTMLTextAreaElement = element.querySelector('* > textarea')!;
    if ((propsAfter.status === 'typing' || propsAfter.status === 'waiting') && textArea.disabled) {
        textArea.disabled = false;
    } else {
        if (propsAfter.status === 'submitting' && !textArea.disabled) {
            textArea.disabled = true;
        }
    }

    const submitButton: HTMLButtonElement = element.querySelector('* > button')!;
    if (propsAfter.status === 'typing' && submitButton.disabled) {
        submitButton.disabled = false;
    } else {
        if ((propsAfter.status === 'waiting' || propsAfter.status === 'submitting') && !submitButton.disabled) {
            submitButton.disabled = true;
        }
    }

    if (propsBefore.placeholder !== propsAfter.placeholder) {
        textArea.placeholder = propsAfter.placeholder ?? '';
    }

    if (propsBefore.message !== propsAfter.message) {
        textArea.value = propsAfter.message ?? '';
    }

    if (propsBefore.autoFocus !== propsAfter.autoFocus) {
        textArea.autofocus = propsAfter.autoFocus ?? false;
    }
};
