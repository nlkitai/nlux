import {MessageDirection} from '../props';

export const directionClassName: {[key: string]: string} = {
    incoming: 'nlux_msg_incoming',
    outgoing: 'nlux_msg_outgoing',
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
