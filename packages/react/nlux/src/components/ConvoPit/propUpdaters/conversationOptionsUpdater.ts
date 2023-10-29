import {ConversationOptions} from '@nlux/nlux';

export const conversationOptionsUpdater = (
    currentConversationOptions: ConversationOptions | undefined,
    newConversationOptions: ConversationOptions | undefined,
): Partial<ConversationOptions> => {
    if (currentConversationOptions === undefined && newConversationOptions === undefined) {
        return {};
    }

    if (newConversationOptions === undefined) {
        return {};
    }

    if (currentConversationOptions === undefined) {
        return newConversationOptions;
    }

    const newProps: Partial<ConversationOptions> = {};
    const keys = Object.keys(newConversationOptions) as Array<keyof ConversationOptions>;
    for (const key of keys) {
        if (currentConversationOptions[key] !== newConversationOptions[key]) {
            newProps[key] = newConversationOptions[key] as any;
        }
    }

    return newProps;
};
