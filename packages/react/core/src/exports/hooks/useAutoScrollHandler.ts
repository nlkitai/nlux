import {MutableRefObject, useEffect, useRef, useState} from 'react';
import {createAutoScrollHandler} from '../../../../../shared/src/interactions/autoScroll/autoScrollHandler';
import {AutoScrollHandler} from '../../../../../shared/src/interactions/autoScroll/type';

const defaultAutoScrollOption = true;

export const useAutoScrollHandler = (
    conversationContainerRef: MutableRefObject<HTMLDivElement | null>,
    autoScroll?: boolean,
) => {
    const [autoScrollHandler, setAutoScrollHandler] = useState<AutoScrollHandler>();
    const [conversationContainer, setConversationContainer] = useState<HTMLDivElement>();

    const autoScrollHandlerRef = useRef(autoScrollHandler);
    const autoScrollPropRef = useRef(autoScroll);

    useEffect(() => {
        const currentConversationContainer = conversationContainerRef.current || undefined;
        if (currentConversationContainer !== conversationContainer) {
            setConversationContainer(currentConversationContainer);
        }
    }); // No dependencies - If statement inside the effect will handle the update

    useEffect(() => {
        if (!conversationContainer) {
            if (autoScrollHandlerRef.current) {
                autoScrollHandlerRef.current.destroy();
                setAutoScrollHandler(undefined);
                autoScrollHandlerRef.current = undefined;
            }

            return;
        }

        if (autoScrollHandlerRef.current) {
            autoScrollHandlerRef.current.updateConversationContainer(conversationContainer);
        } else {
            autoScrollHandlerRef.current = createAutoScrollHandler(
                conversationContainer,
                autoScrollPropRef.current ?? defaultAutoScrollOption,
            );
            setAutoScrollHandler(autoScrollHandlerRef.current);
        }
    }, [conversationContainer]);

    useEffect(() => {
        autoScrollPropRef.current = autoScroll;
        if (autoScrollHandlerRef.current) {
            autoScrollHandlerRef.current.updateProps({
                autoScroll: autoScroll ?? defaultAutoScrollOption,
            });
        }
    }, [autoScroll]);

    return autoScrollHandler;
};
