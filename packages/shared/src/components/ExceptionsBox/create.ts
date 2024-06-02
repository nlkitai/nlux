import {DomCreator} from '../../types/dom/DomCreator';

export const className = 'nlux-comp-exceptionBox';

export const createExceptionsBoxDom: DomCreator<void> = () => {
    const exceptionsBox = document.createElement('div');
    exceptionsBox.classList.add(className);

    return exceptionsBox;
};

export const createExceptionItemDom: DomCreator<{
    message: string;
}> = ({message}) => {
    const exception = document.createElement('div');
    exception.classList.add('nlux-comp-exceptionItem');

    const messageElement = document.createElement('span');
    messageElement.classList.add('nlux-comp-exp_itm_msg');
    messageElement.append(document.createTextNode(message));
    exception.append(messageElement);

    return exception;
};
