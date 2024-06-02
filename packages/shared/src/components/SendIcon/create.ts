export const className = 'nlux-comp-sendIcon';

export const createSendIconDom = () => {
    const sendIcon = document.createElement('div');
    sendIcon.classList.add(className);

    const sndIcnCtn = document.createElement('div');
    sndIcnCtn.classList.add('nlux-comp-sendIcon-container');
    sendIcon.appendChild(sndIcnCtn);

    return sendIcon;
};
