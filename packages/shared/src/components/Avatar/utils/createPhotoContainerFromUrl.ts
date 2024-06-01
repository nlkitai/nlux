export const renderedPhotoContainerClassName = 'avtr_ctn';
export const renderedPhotoClassName = 'avtr_img';

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
