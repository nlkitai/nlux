const globalMetaData: {
    version?: string;
    [key: string]: unknown;
} = {
    version: '{versions.nlux}',
    [btoa('sectionsRegistered')]: false,
};

export const getGlobalMetaData = (): typeof globalMetaData | undefined => {
    if (typeof window === 'undefined') {
        return undefined;
    }

    const theGlobalObject = window as unknown as Window & { NLUX?: typeof globalMetaData };
    if (typeof theGlobalObject.NLUX === 'object' && typeof theGlobalObject.NLUX.version === 'string') {
        return theGlobalObject.NLUX;
    }

    theGlobalObject.NLUX = globalMetaData;
    return globalMetaData;
};
