import {ChatPictureProps} from '../props';
import {createPhotoContainerFromUrl} from './createPhotoContainerFromUrl';

export const updateContentOnPictureChange = (
    element: HTMLElement,
    propsBefore: ChatPictureProps,
    propsAfter: ChatPictureProps,
): void => {
    if (propsBefore.picture === propsAfter.picture) {
        return;
    }

    if (typeof propsAfter.picture === 'string' && typeof propsBefore.picture === 'string') {
        // When the picture is a string, we update the photo container with the new URL
        const photoDomElement: HTMLElement | null = element.querySelector(
            '* > .cht_pic_ctn > .cht_pic_img',
        );

        if (photoDomElement !== null) {
            photoDomElement.style.backgroundImage = `url("${encodeURI(propsAfter.picture)}")`;
        }
    } else {
        if (typeof propsAfter.picture === 'string') {
            // When the new picture is a string and the old one is not —
            // we create a new photo container from the URL
            const newPhotoDomElement = createPhotoContainerFromUrl(
                propsAfter.picture,
                propsAfter.name,
            );
            element.replaceChildren(newPhotoDomElement);
        } else {
            // When the picture is an HTMLElement, we clone it and append it to the persona dom
            if (propsAfter.picture) {
                element.replaceChildren(propsAfter.picture.cloneNode(true));
            } else {
                // If the new picture is null, we remove the old one
                element.replaceChildren();
            }
        }
    }
};
