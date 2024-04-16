import {ExceptionId} from '../../../../../shared/src/types/exceptions';

export const adapterErrorToExceptionId = (error: any): ExceptionId | null => {
    if (typeof error === 'object' && error !== null) {
        if (error.message?.toLowerCase().includes('connection error')) {
            return 'NX-NT-001';
        }
    }

    return null;
};
