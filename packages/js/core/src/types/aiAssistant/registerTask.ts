export type RegisterTaskResult = {
    success: true;
} | {
    success: false;
    error: string;
};

export type RegisterTaskCallback = (
    contextId: string,
    taskId: string,
    parameters: string[],
) => Promise<RegisterTaskResult>;
