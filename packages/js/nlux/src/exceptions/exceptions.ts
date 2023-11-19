import {ExceptionType} from '../types/exception';

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
