import {NluxError} from '../core/error';

export const throttle = <CallbackType>(callback: CallbackType, limitInMilliseconds: number) => {
    let waiting = false;
    if (typeof callback !== 'function') {
        throw new NluxError({
            source: 'x/throttle',
            message: 'Callback must be a function',
        });
    }

    const throttled: CallbackType = ((...args: any[]) => {
        if (!waiting) {
            callback.apply(this, args);
            waiting = true;
            setTimeout(function () {
                waiting = false;
            }, limitInMilliseconds);
        }
    }) as any;

    return throttled;
};
