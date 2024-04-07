import {debug} from '../utils/debug';

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

    const theWindow: any = window;
    if (typeof theWindow.nlux === 'object' && typeof theWindow.nlux.version === 'string') {
        return theWindow.nlux;
    }

    (window as any).nlux = globalNlux;
    debug('globalNlux', globalNlux);

    return globalNlux;
};
