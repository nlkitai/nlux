import {CallbackFunction} from '../../../types/callbackFunction';

export const triggerAsyncCallback = (trigger: CallbackFunction) => {
    setTimeout(() => {
        trigger();
    }, 1);
};
