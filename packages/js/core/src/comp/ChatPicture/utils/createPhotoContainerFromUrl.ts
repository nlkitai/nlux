export const renderedPhotoContainerClassName = 'cht_pic_ctn';
export const renderedPhotoClassName = 'cht_pic_img';
export const renderedInitialsClassName = 'cht_pic_ltr';

export const createPhotoContainerFromUrl = (url: string | undefined, name: string | undefined): HTMLElement => {
    // We print the first letter of the name in the persona photo
    // Just in case the photo URL does not load
    const letterContainer = document.createElement('span');
    letterContainer.classList.add(renderedInitialsClassName);
    const letter = name && name.length > 0 ? name[0].toUpperCase() : '';
    if (letter.length > 0) {
        letterContainer.append(letter);
    }

    const photoContainer = document.createElement('div');
    photoContainer.classList.add(renderedPhotoContainerClassName);
    photoContainer.append(letterContainer);

    // We load the photo in the foreground
    if (url) {
        const photoDomElement = document.createElement('div');
        photoDomElement.classList.add(renderedPhotoClassName);
        photoDomElement.style.backgroundImage = `url("${encodeURI(url)}")`;
        photoContainer.append(photoDomElement);
    }

    return photoContainer;
};
