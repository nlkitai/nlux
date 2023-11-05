export type ExceptionType = 'error' | 'warning';

export type Exception = {
    type: ExceptionType;
    message: string;
};
