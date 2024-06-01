import {MessageDirection} from '../../Message/props';

export const directionClassName: { [key: string]: string } = {
    received: 'nlux_cht_itm_rcvd',
    sent: 'nlux_cht_itm_snt',
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
