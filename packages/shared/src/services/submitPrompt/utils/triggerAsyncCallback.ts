import {CallbackFunction} from '../../../types/callbackFunction';

export const triggerAsyncCallback = (trigger: CallbackFunction, delay: number = 10) => {
    setTimeout(() => {
        trigger();
    }, delay);
};
