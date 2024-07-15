import {ComposerStatus} from '../props';

export const statusClassName: {[key: string]: string} = {
    typing: 'nlux-composer--typing',
    'submitting-prompt': 'nlux-composer--submitting',
    'submitting-conversation-starter': 'nlux-composer--submitting',
    waiting: 'nlux-composer--waiting',
};

export const applyNewStatusClassName = (element: HTMLElement, status: ComposerStatus) => {
    const statuses = Object.keys(statusClassName);
    statuses.forEach((statusName) => {
        element.classList.remove(statusClassName[statusName]);
    });

    element.classList.add(statusClassName[status]);
};
