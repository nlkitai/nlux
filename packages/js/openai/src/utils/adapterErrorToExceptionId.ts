import {NLErrorId} from '../../../../shared/src/types/exceptions/errors';

export const adapterErrorToExceptionId = (error: unknown): NLErrorId | null => {
    if (typeof error === 'object' && error !== null) {
        const typedError = error as { code?: string; message?: string };
        if (typedError.code === 'invalid_api_key') {
            return 'invalid-api-key';
        }

        if (typedError.message?.toLowerCase().includes('connection error')) {
            return 'connection-error';
        }
    }

    return null;
};
