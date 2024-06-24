import {CallbackFunction} from '../../../types/callbackFunction';

export const triggerAsyncCallback = (trigger: CallbackFunction, delay: number = 1) => {
    setTimeout(() => {
        trigger();
    }, delay);
};
