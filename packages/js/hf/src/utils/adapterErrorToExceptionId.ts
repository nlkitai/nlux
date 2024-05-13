import {NLErrorId} from '../../../../shared/src/types/exceptions/errors';

export const adapterErrorToExceptionId = (error: unknown): NLErrorId | null => {
    if (typeof error === 'object' && error !== null) {
        const errorAsObject = error as Record<string, unknown>;
        if (errorAsObject.code === 'invalid_api_key') {
            return 'invalid-api-key';
        }

        if (
            errorAsObject.message && typeof errorAsObject.message === 'string' &&
            errorAsObject.message.toLowerCase().includes('connection error')
        ) {
            return 'connection-error';
        }
    }

    return null;
};
