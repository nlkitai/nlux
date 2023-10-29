import {PromptBoxOptions} from '@nlux/nlux';

export const promptBoxOptionsUpdater = (
    currentPromptBoxOptions: PromptBoxOptions | undefined,
    newPromptBoxOptions: PromptBoxOptions | undefined,
): Partial<PromptBoxOptions> => {
    if (currentPromptBoxOptions === undefined && newPromptBoxOptions === undefined) {
        return {};
    }

    if (newPromptBoxOptions === undefined) {
        return {};
    }

    if (currentPromptBoxOptions === undefined) {
        return newPromptBoxOptions;
    }

    const newProps: Partial<PromptBoxOptions> = {};
    const keys = Object.keys(newPromptBoxOptions) as Array<keyof PromptBoxOptions>;
    for (const key of keys) {
        if (currentPromptBoxOptions[key] !== newPromptBoxOptions[key]) {
            newProps[key] = newPromptBoxOptions[key] as any;
        }
    }

    return newProps;
};
