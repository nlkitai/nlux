import {NLErrorId} from '../../../../shared/src/types/exceptions/errors';

export const adapterErrorToExceptionId = (error: any): NLErrorId | null => {
    if (typeof error === 'object' && error !== null) {
        if (error.code === 'invalid_api_key') {
            return 'invalid-api-key';
        }

        if (error.message?.toLowerCase().includes('connection error')) {
            return 'connection-error';
        }
    }

    return null;
};
