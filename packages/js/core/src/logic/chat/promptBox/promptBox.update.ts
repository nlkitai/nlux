import {updatePromptBoxDom} from '../../../../../../shared/src/ui/PromptBox/update';
import {CompUpdater} from '../../../types/comp';
import {CompPromptBoxActions, CompPromptBoxElements, CompPromptBoxProps} from './promptBox.types';

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
