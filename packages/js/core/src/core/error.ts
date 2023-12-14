import {ExceptionId} from '../exceptions/exceptions';

export type NluxRawError = {
    readonly message?: string;
    readonly type?: string;
    readonly source?: string;
    readonly exceptionId?: ExceptionId;
};

export class NluxError extends Error {
    readonly exceptionId?: ExceptionId;
    readonly message: string;
    readonly source?: string;
    readonly type: string;

    constructor(rawError: NluxRawError = {}) {
        super(rawError.message);

        this.message = rawError.message ?? '';
        this.source = rawError.source;
        this.type = this.constructor.name;
        this.exceptionId = rawError.exceptionId;
    }
}

export class NluxUsageError extends NluxError {
}

export class NluxValidationError extends NluxError {
}

export class NluxRenderingError extends NluxError {
}

export class NluxConfigError extends NluxError {
}
