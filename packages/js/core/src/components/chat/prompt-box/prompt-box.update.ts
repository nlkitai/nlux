import {updatePromptBoxDom} from '../../../comp/PromptBox/update';
import {CompUpdater} from '../../../types/comp';
import {CompPromptBoxActions, CompPromptBoxElements, CompPromptBoxProps} from './prompt-box.types';

export const updateChatbox: CompUpdater<CompPromptBoxProps, CompPromptBoxElements, CompPromptBoxActions> = ({
    propName,
    currentValue,
    newValue,
    dom: {elements, actions},
}) => {
    if (propName === 'domCompProps' && elements?.root) {
        updatePromptBoxDom(elements.root, currentValue, newValue);
    }
};
