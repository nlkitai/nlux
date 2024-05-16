export const className = 'nlux_sndIcn';

export const createSendIconDom = () => {
    const sendIcon = document.createElement('div');
    sendIcon.classList.add(className);
    sendIcon.innerHTML = `<div class="snd_icn_ctn"></div>`;
    return sendIcon;
};
