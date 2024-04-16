import {ExceptionId} from './exceptions';

export type ExceptionType = 'error' | 'warning';

export type Exception = {
    type: 'error';
    id: ExceptionId;
    message: string;
} | {
    type: 'warning';
    message: string;
};
