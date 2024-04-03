import {DomCreator} from '../../types/dom/DomCreator';
import {ExceptionsBoxProps} from './props';

export const className = 'nlux_comp_exp_box';

export const createExceptionsBoxDom: DomCreator<ExceptionsBoxProps> = (props) => {
    const exceptionsBox = document.createElement('div');
    exceptionsBox.classList.add(className);
    exceptionsBox.appendChild(
        document.createTextNode(props.message),
    );

    return exceptionsBox;
};
