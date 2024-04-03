export const className = 'nlux_snd_icn';

export const createSendIconDom = () => {
    const sendIcon = document.createElement('div');
    sendIcon.classList.add(className);
    sendIcon.innerHTML = `<div class="snd_icn_ctn">` +
        `<svg fill="currentColor" version="1.1" viewBox="0 0 495 495" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">`
        +
        `<path d="m164.71 456.69c0 2.966 1.647 5.686 4.266 7.072 2.617 1.385 5.799 1.207 8.245-0.468l55.09-37.616-67.6-32.22v63.232z"/>`
        +
        `<path d="m492.43 32.443c-1.513-1.395-3.466-2.125-5.44-2.125-1.19 0-2.377 0.264-3.5 0.816l-475.59 233.29c-4.861 2.389-7.937 7.353-7.904 12.783 0.033 5.423 3.161 10.353 8.057 12.689l125.34 59.724 250.62-205.99-219.56 220.79 156.14 74.4c1.918 0.919 4.012 1.376 6.084 1.376 1.768 0 3.519-0.322 5.186-0.977 3.637-1.438 6.527-4.318 7.97-7.956l154.6-390c1.224-3.069 0.426-6.578-2.005-8.814z"/>`
        +
        `</svg>` +
        `</div>`;

    return sendIcon;
};
