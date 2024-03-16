import {ContextItemDataType, ContextItemHandler} from '@nlux/core';
import {useContext, useEffect, useRef, useState} from 'react';
import {AiContext} from '../types/AiContext';

export type UpdateContextItem = (itemValue: ContextItemDataType) => void;
export type DiscardContextItem = () => void;

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
