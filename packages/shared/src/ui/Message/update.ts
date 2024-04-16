import {DomUpdater} from '../../types/dom/DomUpdater';
import {createLoaderDom} from '../Loader/create';
import {MessageProps} from './props';
import {applyNewDirectionClassName} from './utils/applyNewDirectionClassName';
import {applyNewStatusClassName} from './utils/applyNewStatusClassName';
import {updateContentOnMessageChange} from './utils/updateContentOnMessageChange';
import {updateContentOnStatusChange} from './utils/updateContentOnStatusChange';

export const updateMessageDom: DomUpdater<MessageProps> = (
    element,
    propsBefore,
    propsAfter,
) => {
    if (
        propsBefore.message === propsAfter.message &&
        propsBefore.status === propsAfter.status &&
        propsBefore.direction === propsAfter.direction &&
        propsBefore.loader === propsAfter.loader
    ) {
        return;
    }

    if (!propsAfter || (
        !propsAfter.hasOwnProperty('message') &&
        !propsAfter.hasOwnProperty('status') &&
        !propsAfter.hasOwnProperty('direction') &&
        !propsAfter.hasOwnProperty('loader')
    )) {
        return;
    }

    //
    // Direction change
    //
    if (propsBefore.direction !== propsAfter.direction) {
        applyNewDirectionClassName(element, propsAfter.direction);
    }

    //
    // Status change
    //
    const currentStatus = propsAfter.status;
    if (propsBefore.status !== currentStatus) {
        applyNewStatusClassName(element, propsAfter.status);
        updateContentOnStatusChange(element, propsBefore, propsAfter);
        return;
    }

    //
    // No status change
    //
    if (currentStatus === 'loading') {
        if (propsBefore.loader !== propsAfter.loader) {
            element.replaceChildren();
            element.append(propsAfter.loader ?? createLoaderDom());
        }

        // We do not need to update the message content in case of loading status
        return;
    }

    if (currentStatus === 'rendered') {
        if (propsBefore.message !== propsAfter.message) {
            updateContentOnMessageChange(element, propsBefore, propsAfter);
        }
    }
};
