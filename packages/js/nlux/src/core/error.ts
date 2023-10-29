export type NluxRawError = {
    readonly message?: string;
    readonly type?: string;
    source?: string;
};

export class NluxError extends Error {
    readonly message: string;
    readonly source?: string;
    readonly type: string;

    constructor(rawError: NluxRawError = {}) {
        super(rawError.message);

        this.message = rawError.message ?? '';
        this.source = rawError.source;
        this.type = this.constructor.name;
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
