import {ConversationItem, uid} from '@nlux/core';
import {useMemo} from 'react';
import {ConversationMessage} from '../props';

export const useInitialMessagesOnce: <MessageType>(
    initialItems?: ConversationItem<MessageType>[],
) => ConversationMessage<MessageType>[] | undefined = (
    initialItems,
) => {
    return useMemo(() => {
        if (initialItems) {
            const newIds: string[] = [];
            return initialItems.map((item) => {
                let newId = uid();

                // Ensure that the new id is unique
                while (newIds.some((id) => id === newId)) {
                    newId = uid();
                }

                newIds.push(newId);
                return {
                    id: newId,
                    role: item.role,
                    message: item.message,
                };
            });
        }
    }, []);
};
