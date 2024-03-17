import {ContextTaskHandler} from '@nlux/core';
import {useContext, useEffect, useRef, useState} from 'react';
import {AiContext} from '../types/AiContext';

/**
 * Use this hook to register a new task that can be trigger by the AI during <AiChat /> conversations.
 * It will create a new AI context task and will keep it in sync with the AI context.
 * The description is used by LLMs to understand the purpose of the task.
 * The callback is the function that will be called when the task is triggered.
 * The parametersDescription is used by LLMs to determine the value of each parameter to be passed to the task.
 *
 * @param {AiContext} aiContext The AI context instance to use, created with createAiContext()
 * @param {string} taskDescription The description of the task. This will be used by LLMs to understand context.
 * @param {Function} callback The function to be called when the task is triggered.
 * @param {string[]} parametersDescription An array of descriptions for each parameter of the task.
 *
 * Usage example:
 *
 * ```tsx
 * const MyComponent = () => {
 *   const taskCallback = useCallback((param1, param2) => {
 *     // Do something with the parameters
 *   }, []);
 *
 *   useAiTask(
 *      MyAiContext, 'Description of the task',
 *      taskCallback, ['Description of the first parameter', 'Description of the second parameter']
 *    );
 *
 *   return <div>...</div>;
 * };
 * ```
 */
export const useAiTask = (
    aiContext: AiContext, taskDescription: string, callback: Function, parametersDescription?: string[],
) => {
    const coreAiContext = useContext(aiContext.ref);
    const [taskId] = useState(() => {
        let itemUniqueId: string;
        do {
            itemUniqueId = Math.random().toString(36).substring(2, 15);
        }
        while (coreAiContext.hasTask(itemUniqueId));

        return itemUniqueId;
    });

    const observerRef = useRef<ContextTaskHandler | undefined>();

    useEffect(() => {
        observerRef.current = coreAiContext.registerTask(
            taskId,
            taskDescription,
            callback,
            parametersDescription,
        );

        return () => {
            observerRef.current?.discard();
            observerRef.current = undefined;
        };
    }, []);

    useEffect(() => {
        observerRef.current?.setDescription(taskDescription);
    }, [taskDescription]);

    useEffect(() => {
        observerRef.current?.setCallback(callback);
    }, [callback]);

    useEffect(() => {
        observerRef.current?.setParamDescriptions(parametersDescription ?? []);
    }, [parametersDescription]);
};
