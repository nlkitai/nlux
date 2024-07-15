import {MessageStatus} from '../props';

export const statusClassName: {[key: string]: string} = {
    streaming: 'nlux_msg_streaming',
    complete: 'nlux_msg_complete',
};

export const applyNewStatusClassName = (element: HTMLElement, status: MessageStatus) => {
    const statuses = Object.keys(statusClassName);
    statuses.forEach((statusName) => {
        element.classList.remove(statusClassName[statusName]);
    });

    if (statusClassName[status]) {
        element.classList.add(statusClassName[status]);
    }
};
