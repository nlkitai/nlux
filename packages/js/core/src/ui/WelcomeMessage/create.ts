import {DomCreator} from '../../types/dom/DomCreator';
import {createAvatarDom} from '../Avatar/create';
import {WelcomeMessageProps} from './props';
import {updateWelcomeMessageText} from './utils/updateWelcomeMessageText';

export const className = 'nlux_comp_wlc_msg';
export const personaNameClassName = 'nlux_comp_wlc_msg_prs_nm';

export const createWelcomeMessageDom: DomCreator<WelcomeMessageProps> = (
    props,
): HTMLElement => {
    const element = document.createElement('div');
    element.classList.add(className);

    const personaPicture = createAvatarDom({
        name: props.name,
        picture: props.picture,
    });
    element.append(personaPicture);

    const personaName = document.createElement('div');
    const nameTextNode = document.createTextNode(props.name);
    personaName.append(nameTextNode);
    personaName.classList.add(personaNameClassName);
    element.append(personaName);

    updateWelcomeMessageText(element, props.message);

    return element;
};
