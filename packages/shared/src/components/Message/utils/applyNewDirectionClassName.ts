import {MessageDirection} from '../props';

export const directionClassName: {[key: string]: string} = {
    received: 'nlux_msg_received',
    sent: 'nlux_msg_sent',
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
