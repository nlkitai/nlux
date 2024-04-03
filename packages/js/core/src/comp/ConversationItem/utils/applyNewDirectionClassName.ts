import {MessageDirection} from '../../Message/props';

export const directionClassName: {[key: string]: string} = {
    incoming: 'nlux_cnv_itm_incoming',
    outgoing: 'nlux_cnv_itm_outgoing',
};

export const applyNewDirectionClassName = (element: HTMLElement, direction: MessageDirection) => {
    const directions = Object.keys(directionClassName);
    directions.forEach((directionName) => {
        element.classList.remove(directionClassName[directionName]);
    });

    if (directionClassName[direction]) {
        element.classList.add(directionClassName[direction]);
    }
};
