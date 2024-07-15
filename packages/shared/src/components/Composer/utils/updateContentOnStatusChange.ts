import {ComposerProps} from '../props';

export const updateContentOnStatusChange = (
    element: HTMLElement,
    propsBefore: ComposerProps,
    propsAfter: ComposerProps,
) => {
    if (propsBefore.status === propsAfter.status) {
        return;
    }

    const textArea: HTMLTextAreaElement = element.querySelector('* > textarea')!;
    if ((propsAfter.status === 'typing' || propsAfter.status === 'waiting') && textArea.disabled) {
        textArea.disabled = false;
    } else {
        if ((propsAfter.status === 'submitting-prompt' || propsAfter.status === 'submitting-conversation-starter')
            && !textArea.disabled) {
            textArea.disabled = true;
        }
    }

    const submitButton: HTMLButtonElement = element.querySelector('* > button')!;
    if (propsAfter.status === 'typing') {
        const disableSubmitButton = propsBefore.disableSubmitButton !== propsAfter.disableSubmitButton ?
            propsAfter.disableSubmitButton :
            propsBefore.disableSubmitButton;

        const shouldDisableSubmit = disableSubmitButton ?? textArea.value === '';
        if (submitButton.disabled !== shouldDisableSubmit) {
            submitButton.disabled = shouldDisableSubmit;
        }
    } else {
        if (
            (
                propsAfter.status === 'waiting' || propsAfter.status === 'submitting-prompt'
                || propsAfter.status === 'submitting-conversation-starter'
            )
            && !submitButton.disabled
        ) {
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
