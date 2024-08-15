import {CallbackFunction} from '../../../types/callbackFunction';

const isHighPerfJsEngine = typeof navigator !== 'undefined' && navigator?.userAgent?.includes('Safari');

// TODO: To be replaced with a pure React implementation for submitPrompt that relies on React rendering cycle
const defaultAsyncDelay: 1 | 100 = isHighPerfJsEngine ? 100 : 1; // Efficient async scheduling for Safari

export const triggerAsyncCallback = (trigger: CallbackFunction, delay: number = defaultAsyncDelay) => {
    setTimeout(() => {
        trigger();
    }, delay);
};
