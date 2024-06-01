import {DomUpdater} from '../../types/dom/DomUpdater';
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
        propsBefore.direction === propsAfter.direction
    ) {
        return;
    }

    if (!propsAfter || (
        !propsAfter.hasOwnProperty('message') &&
        !propsAfter.hasOwnProperty('status') &&
        !propsAfter.hasOwnProperty('direction')
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

    if (currentStatus === 'complete') {
        if (propsBefore.message !== propsAfter.message || propsBefore.format !== propsAfter.format) {
            updateContentOnMessageChange(element, propsBefore, propsAfter);
        }
    }
};
