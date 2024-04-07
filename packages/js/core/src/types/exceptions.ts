import {ExceptionType} from './exception';

export const defaultAdapterExceptionId = 'NX-AD-001';

const networkExceptions = {
    'NX-NT-001': {
        type: 'error',
        message: 'Connection error. Please try again.',
    },
    'NX-NT-002': {
        type: 'error',
        message: 'Invalid API key. Please update it and try again.',
    },
    'NX-NT-003': {
        type: 'error',
        message: 'Sorry, cannot call API. HTTP server side error.',
    },
    'NX-NT-004': {
        type: 'error',
        message: 'Sorry, cannot call API. HTTP client side error.',
    },
};

const adapterExceptions = {
    'NX-AD-001': {
        type: 'error',
        message: 'Failed to load content. Please try again.',
    },
};

const AllExceptions = {
    ...networkExceptions,
    ...adapterExceptions,
};

export type ExceptionId = keyof typeof AllExceptions;

export const NluxExceptions = AllExceptions as Record<ExceptionId, {
    type: ExceptionType;
    message: string;
}>;
