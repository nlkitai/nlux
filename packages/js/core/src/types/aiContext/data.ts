export type ContextItemDataType = number | string | boolean | null | ContextObject | ContextItemDataType[];

export type ContextObject = {
    [key: string]: ContextItemDataType;
};

export type ContextItem = {
    value: ContextItemDataType;
    description: string;
};

export type ContextItems = Record<string, ContextItem>;

export type ContextTask = {
    description: string;
    paramDescriptions: string[];
};

export type ContextTasks = Record<string, ContextTask>;
