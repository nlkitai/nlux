export type SetContextResult = {
    success: true;
    contextId: string;
} | {
    success: false;
    error: string;
};

export type SetContextCallback = (
    initialData: Record<string, any> | undefined,
) => Promise<SetContextResult>;
