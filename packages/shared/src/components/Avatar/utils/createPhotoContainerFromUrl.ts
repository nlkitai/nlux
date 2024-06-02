export const renderedPhotoContainerClassName = 'nlux-comp-avatarContainer';
export const renderedPhotoClassName = 'nlux-comp-avatarPicture';

export const createPhotoContainerFromUrl = (url: string | undefined, name: string | undefined): HTMLElement => {
    const photoContainer = document.createElement('div');
    photoContainer.classList.add(renderedPhotoContainerClassName);

    // We load the photo in the foreground
    if (url) {
        const photoDomElement = document.createElement('div');
        photoDomElement.classList.add(renderedPhotoClassName);
        photoDomElement.style.backgroundImage = `url("${encodeURI(url)}")`;
        photoContainer.append(photoDomElement);
    }

    return photoContainer;
};
