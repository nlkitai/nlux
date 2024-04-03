import {PromptBoxStatus} from '../props';

export const statusClassName: {[key: string]: string} = {
    typing: 'nlux_prmpt_typing',
    submitting: 'nlux_prmpt_submitting',
    waiting: 'nlux_prmpt_waiting',
};

export const applyNewStatusClassName = (element: HTMLElement, status: PromptBoxStatus) => {
    const statuses = Object.keys(statusClassName);
    statuses.forEach((statusName) => {
        element.classList.remove(statusClassName[statusName]);
    });

    element.classList.add(statusClassName[status]);
};
