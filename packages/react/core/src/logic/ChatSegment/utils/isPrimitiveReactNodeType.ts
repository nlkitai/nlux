// Types that can be rendered in React
import {CallbackArgType} from '../../../../../../shared/src/types/callbackFunction';

export const isPrimitiveReactNodeType = (value: CallbackArgType) => {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null
        || value === undefined;
};
