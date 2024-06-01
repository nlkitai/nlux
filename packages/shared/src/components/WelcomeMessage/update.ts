import {DomUpdater} from '../../types/dom/DomUpdater';
import {className as avatarClassName} from '../Avatar/create';
import {updateAvatarDom} from '../Avatar/update';
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
        propsBefore.avatar === propsAfter.avatar
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
        propsBefore.avatar !== propsAfter.avatar ||
        propsBefore.name !== propsAfter.name
    ) {
        const avatarElement = element.querySelector<HTMLElement>(`.${avatarClassName}`);
        if (avatarElement) {
            updateAvatarDom(
                avatarElement,
                {
                    name: propsBefore.name,
                    avatar: propsBefore.avatar,
                },
                {
                    name: propsAfter.name,
                    avatar: propsAfter.avatar,
                },
            );
        }
    }
};
