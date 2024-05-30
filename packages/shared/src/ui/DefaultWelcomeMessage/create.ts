import {DomCreator} from '../../types/dom/DomCreator';
import {getNluxSmallPngLogo} from '../Logo/getNluxSmallPngLogo';
import {createWelcomeMessageDom} from '../WelcomeMessage/create';

export const createDefaultWelcomeMessageDom: DomCreator<void> = (): HTMLElement => {
    return createWelcomeMessageDom({
        name: '',
        avatar: getNluxSmallPngLogo(),
    });
};
