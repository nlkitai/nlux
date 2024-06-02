import {CompRenderer} from '../../../types/comp';
import {
    CompConversationStartersActions,
    CompConversationStartersElements,
    CompConversationStartersEvents,
    CompConversationStartersProps,
} from './conversationStarters.types';
import {createConversationStartersDom} from '../conversation/utils/createConversationStartersDom';
import {listenToElement} from '../../../utils/dom/listenToElement';

export const renderConversationStarters: CompRenderer<
    CompConversationStartersProps,
    CompConversationStartersElements,
    CompConversationStartersEvents,
    CompConversationStartersActions
> = ({
         appendToRoot,
         props,
         compEvent,
     }) => {
    const conversationStartersContainer = createConversationStartersDom(
        props.conversationStarters,
    );

    appendToRoot(conversationStartersContainer);

    // Register click event listeners for each conversation starter
    let conversationStarterEventListenersCleanupFns: (() => void)[] = [];
    props.conversationStarters.forEach((conversationStarter, index) => {
        const [_element, removeListener] = listenToElement(
            conversationStartersContainer,
            `:scope > :nth-child(${index + 1})`,
        ).on('click', () => {
            compEvent('conversation-starter-clicked')(conversationStarter);
        }).get();

        conversationStarterEventListenersCleanupFns.push(removeListener);
    });

    return {
        elements: {},
        actions: {},
        onDestroy: () => {
            conversationStarterEventListenersCleanupFns.forEach((fn) => fn());
            conversationStarterEventListenersCleanupFns = [];
            conversationStartersContainer.remove();
        },
    };
};
