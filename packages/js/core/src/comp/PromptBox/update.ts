import {DomUpdater} from '../../types/dom/DomUpdater';
import {PromptBoxProps} from './props';
import {applyNewStatusClassName} from './utils/applyNewStatusClassName';
import {updateContentOnStatusChange} from './utils/updateContentOnStatusChange';

export const updatePromptBoxDom: DomUpdater<PromptBoxProps> = (
    element,
    propsBefore,
    propsAfter,
) => {
    if (
        propsBefore.status === propsAfter.status &&
        propsBefore.message === propsAfter.message &&
        propsBefore.placeholder === propsAfter.placeholder
    ) {
        return;
    }

    if (propsBefore.status !== propsAfter.status) {
        applyNewStatusClassName(element, propsAfter.status);
        updateContentOnStatusChange(element, propsBefore, propsAfter);
        return;
    }

    if (propsBefore.placeholder !== propsAfter.placeholder) {
        const textArea: HTMLTextAreaElement = element.querySelector('* > textarea')!;
        textArea.placeholder = propsAfter.placeholder ?? '';
    }

    if (propsBefore.message !== propsAfter.message) {
        const textArea: HTMLTextAreaElement = element.querySelector('* > textarea')!;
        textArea.value = propsAfter.message ?? '';
    }
};
