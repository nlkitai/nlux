import {CompUpdater} from '../../../types/comp';
import {ExceptionType} from '../../../types/exception';
import {CompExceptionsBoxActions, CompExceptionsBoxElements, CompExceptionsBoxProps} from './types';

export const updateExceptionsBox: CompUpdater<
    CompExceptionsBoxProps, CompExceptionsBoxElements, CompExceptionsBoxActions
> = ({
    propName,
    newValue,
    dom: {elements, actions},
}) => {
    if (propName === 'visible' && typeof newValue === 'boolean' && actions) {
        if (newValue) {
            actions.show();
        } else {
            actions.hide();
        }

        return;
    }

    if (propName === 'message' && typeof newValue === 'string' && actions) {
        actions.setMessage(newValue as string);
        return;
    }

    if ((propName === 'type') && ['error', 'warning'].includes(newValue as string) && actions) {
        actions.setMessageType(newValue as ExceptionType);
        return;
    }

    if ((propName === 'containerMaxWidth') && actions) {
        actions.updateContainerMaxWidth(newValue as number | string | undefined);
        return;
    }
};
