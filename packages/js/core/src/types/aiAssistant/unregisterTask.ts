export type UnregisterTaskResult = {
    success: true;
} | {
    success: false;
    error: string;
};

export type UnregisterTaskCallback = (
    contextId: string,
    taskId: string,
) => Promise<UnregisterTaskResult>;
