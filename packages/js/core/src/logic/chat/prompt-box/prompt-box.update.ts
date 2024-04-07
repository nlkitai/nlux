import {CompUpdater} from '../../../types/comp';
import {updatePromptBoxDom} from '../../../ui/PromptBox/update';
import {CompPromptBoxActions, CompPromptBoxElements, CompPromptBoxProps} from './prompt-box.types';

export const updateChatbox: CompUpdater<CompPromptBoxProps, CompPromptBoxElements, CompPromptBoxActions> = ({
    propName,
    currentValue,
    newValue,
    dom: {elements},
}) => {
    if (propName === 'domCompProps' && elements?.root) {
        updatePromptBoxDom(elements.root, currentValue, newValue);
    }
};
