import {debug} from '../../../../shared/src/utils/debug';

const globalNlux: {
    version: string;
    [key: string]: any;
} = {
    version: '{versions.nlux}',
    [btoa('componentsRegistered')]: false,
};

export const getGlobalNlux = (): typeof globalNlux | undefined => {
    if (typeof window === 'undefined') {
        return undefined;
    }

    const theWindow: Window & {nlux: typeof globalNlux} = window as any;
    if (typeof theWindow.nlux === 'object' && typeof theWindow.nlux.version === 'string') {
        return theWindow.nlux;
    }

    theWindow.nlux = globalNlux;
    debug('globalNlux', globalNlux);

    return globalNlux;
};
