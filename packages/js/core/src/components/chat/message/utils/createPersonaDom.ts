import {warn} from '../../../../x/debug';
import {render} from '../../../../x/render';
import {__} from '../message.render';

const personaHtml = () => `` +
    `<div class="${__('persona')}">` +
    `</div>`
    + ``;

export const createPersonaDom = (persona: {
    name: string;
    picture: string | HTMLElement;
}): HTMLElement | undefined => {
    const dom = render(personaHtml());
    if (!dom || !(dom instanceof HTMLElement)) {
        return;
    }

    if (!persona.picture || (!(persona.picture instanceof HTMLElement) && typeof persona.picture !== 'string')) {
        warn('Persona picture is not a string or a valid HTMLElement');
        return;
    }

    const photoContainer = document.createElement('div');
    photoContainer.classList.add(__('persona-photo-container'));
    photoContainer.ariaRoleDescription = 'Persona Photo' + (persona.name
        ? ` For Chat Participant ${persona.name}`
        : '');

    if (persona.picture instanceof HTMLElement) {
        // Clone photo dom element and append it to the persona dom
        const photoDomElement = persona.picture.cloneNode(true);
        if (!(photoDomElement instanceof HTMLElement)) {
            // Unlikely to happen
            warn('Photo dom element is not an HTMLElement');
            return;
        }

        photoContainer.append(photoDomElement);
    } else {
        // We print the first letter of the name in the persona photo
        // Just in case the photo URL does not load
        const letterContainer = document.createElement('span');
        letterContainer.classList.add(__('persona-letter'));
        const letter = persona.name && persona.name.length > 0 ? persona.name[0].toUpperCase() : '';
        if (letter.length > 0) {
            letterContainer.append(letter);
        }

        photoContainer.append(letterContainer);

        // We load the photo in the foreground
        const photoDomElement = document.createElement('div');
        photoDomElement.classList.add(__('persona-rendered-photo'));
        photoDomElement.style.backgroundImage = `url("${encodeURI(persona.picture)}")`;
        photoContainer.append(photoDomElement);
    }

    dom.append(photoContainer);
    return dom;
};
