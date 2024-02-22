export type AssistResult = {
    success: true;
    response: string;
} | {
    success: true;
    response: string;
    taskId: string;
    parameters: string[];
} | {
    success: false;
    error: string;
};

export type AssistCallback = (
    contextId: string,
    prompt: string,
) => Promise<AssistResult>;
