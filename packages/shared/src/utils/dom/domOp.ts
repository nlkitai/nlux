import {CallbackFunction} from '../../types/callbackFunction';

export const domOp = (op: CallbackFunction) => {
    const id = requestAnimationFrame(() => {
        op();
    });

    return () => {
        cancelAnimationFrame(id);
    };
};
