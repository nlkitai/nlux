import {DomUpdater} from '../../types/dom/DomUpdater';
import {ExceptionsBoxProps} from './props';

export const updateExceptionsBox: DomUpdater<ExceptionsBoxProps> = (
    element,
    propsBefore,
    propsAfter,
) => {
    if (propsBefore.message === propsAfter.message) {
        return;
    }

    element.replaceChildren(
        document.createTextNode(propsAfter.message),
    );
};
