import {CompUpdater} from '../../../types/comp';
import {CompPromptBoxActions, CompPromptBoxElements, CompPromptBoxProps} from './types';

export const updateChatbox: CompUpdater<CompPromptBoxProps, CompPromptBoxElements, CompPromptBoxActions> = ({
    propName,
    newValue,
    dom: {elements},
}) => {
    switch (propName) {
        case 'enableTextInput':
            if (elements?.textInput instanceof HTMLTextAreaElement) {
                elements.textInput.disabled = !newValue;
            }

            if (elements?.sendButton instanceof HTMLButtonElement) {
                elements.sendButton.disabled = !newValue;
            }
            break;
        case 'enableSendButton':
            if (elements?.sendButton instanceof HTMLButtonElement) {
                elements.sendButton.disabled = !newValue;
            }
            break;
        case 'textInputValue':
            if (typeof newValue === 'string' && elements?.textInput instanceof HTMLTextAreaElement) {
                elements.textInput.value = newValue;
            }
            break;
    }
};
