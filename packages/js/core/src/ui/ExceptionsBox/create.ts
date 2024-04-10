import {DomCreator} from '../../types/dom/DomCreator';
import {ExceptionsBoxProps} from './props';

export const className = 'nlux-comp-exp_box';

export const createExceptionsBoxDom: DomCreator<ExceptionsBoxProps> = (props) => {
    const exceptionsBox = document.createElement('div');
    exceptionsBox.classList.add(className);
    exceptionsBox.appendChild(
        document.createTextNode(props.message),
    );

    return exceptionsBox;
};
