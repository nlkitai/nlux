import {render} from '../../../../x/render';
import {warn} from '../../../../x/warn';
import {__} from '../conversation.render';

const welcomeMessageHtml = () => `` +
    `<div class="${__('welcome-message')}">` +
    `</div>`
    + ``;

export const createEmptyWelcomeMessage = (): HTMLElement | undefined => {
    const dom = render(welcomeMessageHtml());
    if (!dom || !(dom instanceof HTMLElement)) {
        return;
    }

    return dom;
};

export const createWelcomeMessage = (persona: {
    name: string;
    picture: string | HTMLElement;
    tagline?: string;
}): HTMLElement | undefined => {
    const dom = render(welcomeMessageHtml());
    if (!dom || !(dom instanceof HTMLElement)) {
        return;
    }

    if (!persona.picture || (!(persona.picture instanceof HTMLElement) && typeof persona.picture !== 'string')) {
        warn('Welcome persona picture is not a string or a valid HTMLElement');
        return;
    }

    const photoContainer = document.createElement('div');
    photoContainer.classList.add(__('welcome-message-photo-container'));
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
        letterContainer.classList.add(__('welcome-message-letter'));
        letterContainer.innerText = persona.name && persona.name.length > 0 ? persona.name[0].toUpperCase() : '';
        photoContainer.append(letterContainer);

        // We load the photo in the foreground
        const photoDomElement = document.createElement('div');
        photoDomElement.classList.add(__('welcome-message-rendered-photo'));
        photoDomElement.style.backgroundImage = `url("${encodeURI(persona.picture)}")`;
        photoContainer.append(photoDomElement);
    }

    dom.append(photoContainer);

    if (persona.tagline) {
        const nameAndTaglineContainer = document.createElement('div');
        nameAndTaglineContainer.classList.add(__('welcome-message-name-and-tagline'));

        const nameContainer = document.createElement('h3');
        nameContainer.classList.add(__('welcome-message-name'));
        nameContainer.append(persona.name);

        const taglineContainer = document.createElement('span');
        taglineContainer.classList.add(__('welcome-message-tagline'));
        taglineContainer.append(persona.tagline);

        nameAndTaglineContainer.append(nameContainer);
        nameAndTaglineContainer.append(taglineContainer);

        dom.append(nameAndTaglineContainer);
    }

    return dom;
};
