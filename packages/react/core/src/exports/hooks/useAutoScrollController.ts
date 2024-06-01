import {MutableRefObject, useEffect, useRef, useState} from 'react';
import {createAutoScrollController} from '@shared/interactions/autoScroll/autoScrollController';
import {AutoScrollController} from '@shared/interactions/autoScroll/type';

const defaultAutoScrollOption = true;

export const useAutoScrollController = (
    conversationContainerRef: MutableRefObject<HTMLDivElement | null>,
    autoScroll?: boolean,
) => {
    const [autoScrollController, setAutoScrollController] = useState<AutoScrollController>();
    const [conversationContainer, setConversationContainer] = useState<HTMLDivElement>();

    const autoScrollControllerRef = useRef(autoScrollController);
    const autoScrollPropRef = useRef(autoScroll);

    useEffect(() => {
        const currentConversationContainer = conversationContainerRef.current || undefined;
        if (currentConversationContainer !== conversationContainer) {
            setConversationContainer(currentConversationContainer);
        }
    }); // No dependencies - If statement inside the effect will handle the update

    useEffect(() => {
        if (!conversationContainer) {
            if (autoScrollControllerRef.current) {
                autoScrollControllerRef.current.destroy();
                setAutoScrollController(undefined);
                autoScrollControllerRef.current = undefined;
            }

            return;
        }

        if (autoScrollControllerRef.current) {
            autoScrollControllerRef.current.updateConversationContainer(conversationContainer);
        } else {
            autoScrollControllerRef.current = createAutoScrollController(
                conversationContainer,
                autoScrollPropRef.current ?? defaultAutoScrollOption,
            );
            setAutoScrollController(autoScrollControllerRef.current);
        }
    }, [conversationContainer]);

    useEffect(() => {
        autoScrollPropRef.current = autoScroll;
        if (autoScrollControllerRef.current) {
            autoScrollControllerRef.current.updateProps({
                autoScroll: autoScroll ?? defaultAutoScrollOption,
            });
        }
    }, [autoScroll]);

    return autoScrollController;
};
