export const adapterErrorToExceptionId = (error: any): string | null => {
    if (typeof error === 'object' && error !== null) {
        if (error.code === 'invalid_api_key') {
            return 'NX-NT-002';
        }

        if (error.message?.toLowerCase().includes('connection error')) {
            return 'NX-NT-001';
        }
    }

    return null;
};
