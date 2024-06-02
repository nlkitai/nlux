import {DomCreator} from '../../types/dom/DomCreator';
import {createAvatarDom} from '../Avatar/create';
import {WelcomeMessageProps} from './props';
import {updateWelcomeMessageText} from './utils/updateWelcomeMessageText';

export const className = 'nlux-comp-welcomeMessage';
export const personaNameClassName = 'nlux-comp-welcomeMessage-personaName';

export const createWelcomeMessageDom: DomCreator<WelcomeMessageProps> = (
    props,
): HTMLElement => {
    const element = document.createElement('div');
    element.classList.add(className);

    const personaAvatar = createAvatarDom({
        name: props.name,
        avatar: props.avatar,
    });
    element.append(personaAvatar);

    const personaName = document.createElement('div');
    const nameTextNode = document.createTextNode(props.name);
    personaName.append(nameTextNode);
    personaName.classList.add(personaNameClassName);
    element.append(personaName);

    updateWelcomeMessageText(element, props.message);

    return element;
};
