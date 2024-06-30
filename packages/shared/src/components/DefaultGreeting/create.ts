import {DomCreator} from '../../types/dom/DomCreator';
import {getNluxSmallPngLogo} from '../Logo/getNluxSmallPngLogo';
import {createGreetingDom} from '../Greeting/create';

export const createDefaultGreetingDom: DomCreator<void> = (): HTMLElement => {
    return createGreetingDom({
        name: '',
        avatar: getNluxSmallPngLogo(),
    });
};
