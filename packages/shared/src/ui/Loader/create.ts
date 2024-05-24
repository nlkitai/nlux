import { sanitizeHTML } from '../../../../js/core/src/exports/sanitizer';
import { DomCreator } from '../../types/dom/DomCreator';

export const className = 'nlux_msg_ldr';

export const createLoaderDom: DomCreator<void> = () => {
  const loader = document.createElement('div');
  loader.classList.add(className);
  const sanitizedHTML = sanitizeHTML(
    `<div class="spn_ldr_ctn"><span class="spn_ldr"></span></div>`
  );
  loader.innerHTML = sanitizedHTML;
  return loader;
};
