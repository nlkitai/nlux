import {ComposerStatus} from '../props';

export const statusClassName: { [key: string]: string } = {
    typing: 'nlux-prmpt-typing',
    'submitting-prompt': 'nlux-prmpt-submitting',
    'submitting-conversation-starter': 'nlux-prmpt-submitting',
    waiting: 'nlux-prmpt-waiting',
};

export const applyNewStatusClassName = (element: HTMLElement, status: ComposerStatus) => {
    const statuses = Object.keys(statusClassName);
    statuses.forEach((statusName) => {
        element.classList.remove(statusClassName[statusName]);
    });

    element.classList.add(statusClassName[status]);
};
