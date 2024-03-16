import {ContextTaskHandler} from '@nlux/core';
import {useContext, useEffect, useRef, useState} from 'react';
import {AiContext} from '../types/AiContext';

export const useAiTask = (
    aiContext: AiContext, description: string, callback: Function, parametersDescription?: string[],
) => {
    const result = useContext(aiContext.ref);
    const [taskId] = useState(() => {
        let itemUniqueId: string;
        do {
            itemUniqueId = Math.random().toString(36).substring(2, 15);
        }
        while (result.hasItem(itemUniqueId));

        return itemUniqueId;
    });

    const observerRef = useRef<ContextTaskHandler | undefined>();

    useEffect(() => {
        observerRef.current = result.registerTask(
            taskId,
            description,
            callback,
            parametersDescription,
        );

        return () => {
            observerRef.current?.discard();
            observerRef.current = undefined;
        };
    }, []);

    useEffect(() => {
        observerRef.current?.setDescription(description);
    }, [description]);

    useEffect(() => {
        observerRef.current?.setCallback(callback);
    }, [callback]);

    useEffect(() => {
        observerRef.current?.setParamDescriptions(parametersDescription ?? []);
    }, [parametersDescription]);
};
