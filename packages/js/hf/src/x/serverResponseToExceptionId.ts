import {ExceptionId} from '@nlux/nlux';

export const serverResponseToExceptionId = (response: Response): ExceptionId | null => {
    if (response.ok) {
        return null;
    }

    if (response.status >= 500 && response.status < 600) {
        return 'NX-NT-003';
    }

    if (response.status >= 400 && response.status < 500) {
        return 'NX-NT-004';
    }

    return 'NX-NT-001';
};
