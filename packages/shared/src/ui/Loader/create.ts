import {DomCreator} from '../../types/dom/DomCreator';

export const className = 'nlux_msg_ldr';

export const createLoaderDom: DomCreator<void> = () => {
    const loader = document.createElement('div');
    loader.classList.add(className);

    const spinnerLoader = document.createElement('span');
    spinnerLoader.classList.add('spn_ldr');

    const spinnerLoaderContainer = document.createElement('div');
    spinnerLoaderContainer.classList.add('spn_ldr_ctn');
    spinnerLoaderContainer.appendChild(spinnerLoader);

    loader.appendChild(spinnerLoaderContainer);
    return loader;
};
