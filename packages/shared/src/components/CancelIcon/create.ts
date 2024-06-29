export const className = 'nlux-comp-cancelIcon';

export const createCancelIconDom = () => {
    const cancelIcon = document.createElement('div');
    cancelIcon.classList.add(className);

    const cnlIcnCtn = document.createElement('div');
    cnlIcnCtn.classList.add('nlux-comp-cancelIcon-container');
    cancelIcon.appendChild(cnlIcnCtn);

    return cancelIcon;
};
