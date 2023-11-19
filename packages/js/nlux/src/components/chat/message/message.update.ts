import {CompUpdater} from '../../../types/comp';
import {CompMessageActions, CompMessageElements, CompMessageProps} from './message.types';

export const updateMessage: CompUpdater<
    CompMessageProps, CompMessageElements, CompMessageActions
> = ({propName, newValue, dom}) => {
    if (propName === 'loadingStatus' && newValue) {
        dom.actions?.setContentStatus(newValue as any);
    }
};
