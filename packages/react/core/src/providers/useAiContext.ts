import {ContextItemDataType, ContextItemHandler} from '@nlux/core';
import {useContext, useEffect, useRef, useState} from 'react';
import {AiContext} from '../types/AiContext';

export type UpdateContextItem = (itemValue: ContextItemDataType) => void;
export type DiscardContextItem = () => void;

/**
 * Use this hook to sync parts of the component state with the AI context.
 * It will create a new AI context item and will keep it in sync with the AI context.
 * When the state item changes, the itemValue will should be kept up to date.
 * When the component is unmounted, the context item will be discarded.
 *
 * @param {AiContext} aiContext The AI context instance to use, created with createAiContext()
 * @param {string} itemDescription The description of the item. This will be used by LLMs to understand context
 * @param {ContextItemDataType} itemValue The item value to be synced. Changing this value will update the AI context.
 *
 * Usage example:
 *
 * ```tsx
 * const MyComponent = () => {
 *    const [myStateItem, setMyStateItem] = useState('initial value');
 *    useAiContext(MyAiContext, 'Detailed description of my state item', myStateItem);
 *    return <div>...</div>;
 * };
 */
export const useAiContext = (
    aiContext: AiContext,
    itemDescription: string,
    itemValue: ContextItemDataType,
) => {
    const result = useContext(aiContext.ref);
    const [itemId] = useState(() => {
        let itemUniqueId: string;
        do {
            itemUniqueId = Math.random().toString(36).substring(2, 15);
        }
        while (result.hasItem(itemUniqueId));

        return itemUniqueId;
    });

    const observerRef = useRef<ContextItemHandler | undefined>();

    // IMPORTANT: Discard when component is unmounted
    useEffect(() => {
        observerRef.current = result.observeState(
            itemId,
            itemDescription,
            itemValue,
        );

        return () => {
            observerRef.current?.discard();
            observerRef.current = undefined;
        };
    }, []);

    useEffect(() => {
        observerRef.current?.setDescription(itemDescription);
    }, [itemDescription]);

    useEffect(() => {
        observerRef.current?.setData(itemValue);
    }, [itemValue]);
};
