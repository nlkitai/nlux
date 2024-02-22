export type ClearContextResult = {
    success: true;
} | {
    success: false;
    error: string;
};

export type ClearContextCallback = (contextId: string) => Promise<ClearContextResult>;
