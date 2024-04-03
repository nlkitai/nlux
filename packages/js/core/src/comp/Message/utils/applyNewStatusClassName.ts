import {MessageStatus} from '../props';

export const statusClassName: {[key: string]: string} = {
    loading: 'nlux_msg_loading',
    streaming: 'nlux_msg_streaming',
    rendered: 'nlux_msg_rendered',
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
