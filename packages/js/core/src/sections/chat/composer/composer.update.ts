import {updateComposerDom} from '@shared/components/Composer/update';
import {CompUpdater} from '../../../types/comp';
import {CompComposerActions, CompComposerElements, CompComposerProps} from './composer.types';

export const updateChatbox: CompUpdater<CompComposerProps, CompComposerElements, CompComposerActions> = (
    {
        propName,
        currentValue,
        newValue,
        dom,
    }) => {
    if (propName === 'domCompProps' && dom.elements?.root) {
        updateComposerDom(dom.elements.root, currentValue, newValue);
    }
};
