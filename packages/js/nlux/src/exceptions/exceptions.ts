import {Exception} from '../types/exception';

export const defaultAdapterExceptionId = 'NX-AD-001';

const networkExceptions: {
    [key: string]: Exception
} = {
    'NX-NT-001': {
        type: 'error',
        message: 'Connection error. Please try again.',
    },
    'NX-NT-002': {
        type: 'error',
        message: 'Invalid API key. Please update it and try again.',
    },
};

const adapterExceptions: {
    [key: string]: Exception
} = {
    'NX-AD-001': {
        type: 'error',
        message: 'Failed to load content. Please try again.',
    },
};

export const NluxExceptions: {
    [key: string]: Exception
} = {
    ...networkExceptions,
    ...adapterExceptions,
};

