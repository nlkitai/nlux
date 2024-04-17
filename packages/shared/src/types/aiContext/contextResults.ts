export type InitializeContextResult = {
    success: true;
    contextId: string;
} | {
    success: false;
    error: string;
};

export type DestroyContextResult = {
    success: true;
} | {
    success: false;
    error: string;
};

export type FlushContextResult = {
    success: true;
} | {
    success: false;
    error: string;
};

export type RunTaskResult = {
    success: true;
    result?: any;
} | {
    success: false;
    error: string;
};

export type ContextActionResult = {
    success: true;
} | {
    success: false;
    error: string;
};

export type SetContextResult = {
    success: true;
    contextId: string;
} | {
    success: false;
    error: string;
};
