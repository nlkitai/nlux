import {DomUpdater} from '../../types/dom/DomUpdater';
import {ChatPictureProps} from './props';
import {updateContentOnPictureChange} from './utils/updateContentOnPictureChange';
import {updateNameOnPicture} from './utils/updateNameOnPicture';

export const updateChatPictureDom: DomUpdater<ChatPictureProps> = (
    element,
    propsBefore,
    propsAfter,
): void => {
    if (propsBefore.picture === propsAfter.picture && propsBefore.name === propsAfter.name) {
        return;
    }

    if (propsBefore.picture !== propsAfter.picture) {
        updateContentOnPictureChange(element, propsBefore, propsAfter);
    }

    if (propsAfter.name) {
        if (propsBefore.name !== propsAfter.name) {
            element.title = propsAfter.name;
            updateNameOnPicture(element, propsBefore, propsAfter);
        }
    } else {
        element.title = '';
        updateNameOnPicture(element, propsBefore, propsAfter);
    }
};
