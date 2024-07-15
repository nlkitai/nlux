import {DomUpdater} from '../../types/dom/DomUpdater';
import {ComposerProps} from './props';
import {applyNewStatusClassName} from './utils/applyNewStatusClassName';
import {updateContentOnStatusChange} from './utils/updateContentOnStatusChange';

export const updateComposerDom: DomUpdater<ComposerProps> = (
    element,
    propsBefore,
    propsAfter,
) => {
    if (
        propsBefore.status === propsAfter.status &&
        propsBefore.message === propsAfter.message &&
        propsBefore.placeholder === propsAfter.placeholder &&
        propsBefore.autoFocus === propsAfter.autoFocus &&
        propsBefore.disableSubmitButton === propsAfter.disableSubmitButton
    ) {
        return;
    }

    const textArea: HTMLTextAreaElement = element.querySelector('* > textarea')!;
    if (propsBefore.status !== propsAfter.status) {
        applyNewStatusClassName(element, propsAfter.status);
        updateContentOnStatusChange(element, propsBefore, propsAfter);
        //try to update textarea height after recieving new value or after sumbit 
        adjustHeight(textArea);
        return;
    }


    if (propsBefore.placeholder !== propsAfter.placeholder) {
        textArea.placeholder = propsAfter.placeholder ?? '';
    }

    if (propsBefore.autoFocus !== propsAfter.autoFocus) {
        textArea.autofocus = propsAfter.autoFocus ?? false;
    }

    if (propsBefore.message !== propsAfter.message) {
        textArea.value = propsAfter.message ?? '';
        //try to update textarea height after recieving new value or after sumbit 
        adjustHeight(textArea);
    }

    if (propsBefore.status === 'typing') {
        const button: HTMLButtonElement = element.querySelector('* > button')!;
        const disableSubmitButton = propsBefore.disableSubmitButton !== propsAfter.disableSubmitButton ?
            propsAfter.disableSubmitButton :
            propsBefore.disableSubmitButton;

        const shouldDisableSubmit = disableSubmitButton ?? textArea.value === '';
        if (button.disabled !== shouldDisableSubmit) {
            button.disabled = shouldDisableSubmit;
        }
    }
};

const adjustHeight = (target: HTMLElement) => {
    target.style.height = 'auto'; // Reset height
    target.style.height = `${target.scrollHeight}px`; // Set new height based on content
};