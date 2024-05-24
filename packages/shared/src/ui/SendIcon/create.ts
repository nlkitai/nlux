import { sanitizeHTML } from '../../../../js/core/src/exports/sanitizer';

export const className = 'nlux_sndIcn';

export const createSendIconDom = () => {
  const sendIcon = document.createElement('div');
  sendIcon.classList.add(className);
  const sanitizedHTML = sanitizeHTML(`<div class="snd_icn_ctn"></div>`);
  sendIcon.innerHTML = sanitizedHTML;
  return sendIcon;
};
