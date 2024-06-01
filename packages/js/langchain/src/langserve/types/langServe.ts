export type LangServeEndpointType = 'invoke' | 'stream';
export type LangServeHeaders = Record<string, string>;

export type LangServeConfigItem =
    string
    | number
    | boolean
    | { [key: string]: LangServeConfigItem }
    | LangServeConfigItem[];

export type LangServeConfig = {
    [key: string]: LangServeConfigItem;
};

