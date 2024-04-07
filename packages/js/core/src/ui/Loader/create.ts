export const className = 'nlux_msg_ldr';

export const createLoaderDom = () => {
    const loader = document.createElement('div');
    loader.classList.add(className);
    loader.innerHTML = `<div class="spn_ldr_ctn"><span class="spn_ldr"></span></div>`;
    return loader;
};
