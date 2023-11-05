import {CompUpdater} from '../../../types/comp';
import {CompTextMessageActions, CompTextMessageElements, CompTextMessageProps} from './types';

export const updateTextMessage: CompUpdater<
    CompTextMessageProps, CompTextMessageElements, CompTextMessageActions
> = ({propName, newValue, dom}) => {
    if (propName === 'loadingStatus' && newValue) {
        dom.actions?.setLoadingStatus(newValue as any);
    }
};
