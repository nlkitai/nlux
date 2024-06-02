import {DomCreator} from '../../types/dom/DomCreator';

export const className = 'nlux-comp-messageLoader';

export const createLoaderDom: DomCreator<void> = () => {
    const loader = document.createElement('div');
    loader.classList.add(className);

    const spinnerLoader = document.createElement('span');
    spinnerLoader.classList.add('spinning-loader');

    const spinnerLoaderContainer = document.createElement('div');
    spinnerLoaderContainer.classList.add('nlux-comp-loaderContainer');
    spinnerLoaderContainer.appendChild(spinnerLoader);

    loader.appendChild(spinnerLoaderContainer);
    return loader;
};
