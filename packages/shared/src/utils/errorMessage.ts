import {NLErrorId, NLErrors} from '../types/exceptions/errors';

export const getErrorMessage = (error: NLErrorId): string => {
    return NLErrors[error];
};
