import {DomCreator} from '../../types/dom/DomCreator';

export const className = 'nlux-comp-exp_box';

export const createExceptionsBoxDom: DomCreator<void> = () => {
    const exceptionsBox = document.createElement('div');
    exceptionsBox.classList.add(className);

    return exceptionsBox;
};

export const createExceptionItemDom: DomCreator<{
    message: string;
    ref?: string;
}> = ({ref, message}) => {
    const exception = document.createElement('div');
    exception.classList.add('nlux-comp-exp_itm');

    if (ref) {
        const refElement = document.createElement('span');
        refElement.classList.add('nlux-comp-exp_itm_ref');
        refElement.append(document.createTextNode(ref));
        exception.append(refElement);
    }

    const messageElement = document.createElement('span');
    messageElement.classList.add('nlux-comp-exp_itm_msg');
    messageElement.append(document.createTextNode(message));
    exception.append(messageElement);

    return exception;
};
