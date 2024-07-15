import {DomCreator} from '../../types/dom/DomCreator';
import {createGreetingDom} from '../Greeting/create';
import {getNluxSmallPngLogo} from '../Logo/getNluxSmallPngLogo';

export const createDefaultGreetingDom: DomCreator<void> = (): HTMLElement => {
    return createGreetingDom({
        name: '',
        avatar: getNluxSmallPngLogo(),
    });
};
