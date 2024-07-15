import {MessageDirection} from '../../Message/props';

export const directionClassName: {[key: string]: string} = {
    received: 'nlux-comp-chatItem--received',
    sent: 'nlux-comp-chatItem--sent',
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
