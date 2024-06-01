export const className = 'nlux_sndIcn';

export const createSendIconDom = () => {
    const sendIcon = document.createElement('div');
    sendIcon.classList.add(className);

    const sndIcnCtn = document.createElement('div');
    sndIcnCtn.classList.add('snd_icn_ctn');
    sendIcon.appendChild(sndIcnCtn);

    return sendIcon;
};
