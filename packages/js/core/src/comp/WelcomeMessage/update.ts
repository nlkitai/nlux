import {DomUpdater} from '../../types/dom/DomUpdater';
import {className as chatPictureClassName} from '../ChatPicture/create';
import {updateChatPictureDom} from '../ChatPicture/update';
import {personaNameClassName} from './create';
import {WelcomeMessageProps} from './props';
import {updateWelcomeMessageText} from './utils/updateWelcomeMessageText';

export const updateWelcomeMessageDom: DomUpdater<WelcomeMessageProps> = (
    element,
    propsBefore,
    propsAfter,
): void => {
    if (
        propsBefore.message === propsAfter.message &&
        propsBefore.name === propsAfter.name &&
        propsBefore.picture === propsAfter.picture
    ) {
        return;
    }

    if (propsBefore.message !== propsAfter.message) {
        updateWelcomeMessageText(element, propsAfter.message);
    }

    if (propsBefore.name !== propsAfter.name) {
        const nameElement = element.querySelector(`.${personaNameClassName}`);
        if (nameElement) {
            const nameTextNode = document.createTextNode(propsAfter.name);
            nameElement.replaceChildren(nameTextNode);
        }
    }

    if (
        propsBefore.picture !== propsAfter.picture ||
        propsBefore.name !== propsAfter.name
    ) {
        const pictureElement = element.querySelector<HTMLElement>(`.${chatPictureClassName}`);
        if (pictureElement) {
            updateChatPictureDom(
                pictureElement,
                {
                    name: propsBefore.name,
                    picture: propsBefore.picture,
                },
                {
                    name: propsAfter.name,
                    picture: propsAfter.picture,
                },
            );
        }
    }
};
