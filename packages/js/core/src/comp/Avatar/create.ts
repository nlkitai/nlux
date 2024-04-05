import {DomCreator} from '../../types/dom/DomCreator';
import {AvatarProps} from './props';
import {createPhotoContainerFromUrl} from './utils/createPhotoContainerFromUrl';

export const className = 'nlux_comp_avtr';

export const createAvatarDom: DomCreator<AvatarProps> = (
    props,
): HTMLElement => {
    const element = document.createElement('div');
    element.classList.add(className);

    if (!props.picture && !props.name) {
        return element;
    }

    if (props.name) {
        element.title = props.name;
    }

    // When the picture is an HTMLElement, we clone it and append it to the persona dom
    // without any further processing!
    if (props.picture && props.picture instanceof HTMLElement) {
        element.append(props.picture.cloneNode(true));
        return element;
    }

    // Alternatively, treat the picture as a string representing a URL of the photo to
    // be loaded and render the photo accordingly.
    element.append(createPhotoContainerFromUrl(props.picture, props.name));
    return element;
};
