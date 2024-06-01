const globalNlux: {
    version: string;
    [key: string]: unknown;
} = {
    version: '{versions.nlux}',
    [btoa('componentsRegistered')]: false,
};

export const getGlobalNlux = (): typeof globalNlux | undefined => {
    if (typeof window === 'undefined') {
        return undefined;
    }

    const theWindow = window as unknown as Window & { nlux: typeof globalNlux };
    if (typeof theWindow.nlux === 'object' && typeof theWindow.nlux.version === 'string') {
        return theWindow.nlux;
    }

    theWindow.nlux = globalNlux;
    return globalNlux;
};
