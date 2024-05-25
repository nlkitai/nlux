import {DomUpdater} from '../../types/dom/DomUpdater';
import {AvatarProps} from './props';
import {updateContentOnAvatarChange} from './utils/updateContentOnAvatarChange';
import {updateNameOnAvatar} from './utils/updateNameOnAvatar';

export const updateAvatarDom: DomUpdater<AvatarProps> = (
    element,
    propsBefore,
    propsAfter,
): void => {
    if (propsBefore.avatar === propsAfter.avatar && propsBefore.name === propsAfter.name) {
        return;
    }

    if (propsBefore.avatar !== propsAfter.avatar) {
        updateContentOnAvatarChange(element, propsBefore, propsAfter);
    }

    if (propsAfter.name) {
        if (propsBefore.name !== propsAfter.name) {
            element.title = propsAfter.name;
            updateNameOnAvatar(element, propsBefore, propsAfter);
        }
    } else {
        element.title = '';
        updateNameOnAvatar(element, propsBefore, propsAfter);
    }
};
