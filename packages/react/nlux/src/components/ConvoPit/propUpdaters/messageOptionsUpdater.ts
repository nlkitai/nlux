import {MessageOptions} from '@nlux/nlux';

export const messageOptionsUpdater = (
    currentMessageOptions: MessageOptions | undefined,
    newMessageOptions: MessageOptions | undefined,
): Partial<MessageOptions> => {
    if (currentMessageOptions === undefined && newMessageOptions === undefined) {
        return {};
    }

    if (newMessageOptions === undefined) {
        return {};
    }

    if (currentMessageOptions === undefined) {
        return newMessageOptions;
    }

    const newProps: Partial<MessageOptions> = {};
    const keys = Object.keys(newMessageOptions) as Array<keyof MessageOptions>;
    for (const key of keys) {
        if (currentMessageOptions[key] !== newMessageOptions[key]) {
            newProps[key] = newMessageOptions[key] as any;
        }
    }

    return newProps;
};
