import {CompUpdater} from '../../../types/comp';
import {updatePromptBoxDom} from '../../../ui/PromptBox/update';
import {CompPromptBoxActions, CompPromptBoxElements, CompPromptBoxProps} from './prompt-box.types';

export const updateChatbox: CompUpdater<CompPromptBoxProps, CompPromptBoxElements, CompPromptBoxActions> = ({
    propName,
    currentValue,
    newValue,
    dom,
}) => {
    if (propName === 'domCompProps' && dom.elements?.root) {
        updatePromptBoxDom(dom.elements.root, currentValue, newValue);
    }
};
