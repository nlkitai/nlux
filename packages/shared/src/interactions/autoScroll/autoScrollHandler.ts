import {throttle} from '../../utils/throttle';
import {AutoScrollHandler} from './type';
import {createConversationScrollHandler} from './utils/conversationScrollHandler';

export const createAutoScrollHandler = (
    newConversationContainer: HTMLElement,
    autoScroll: boolean,
): AutoScrollHandler => {
    let shouldScrollWhenGenerating: boolean = autoScroll;
    let conversationContainer: HTMLElement | undefined = newConversationContainer;
    let scrollingStickToConversationEnd: boolean = true;
    let activeChatSection: {uid: string; container: HTMLElement} | undefined = undefined;

    const scrollHandler = throttle(createConversationScrollHandler(({
        scrolledToBottom, scrollDirection,
    }) => {
        if (scrollingStickToConversationEnd) {
            // When the user is already at the bottom of the conversation, we stick to the bottom
            // and only unstick when the user scrolls up.
            if (scrollDirection === 'up') {
                scrollingStickToConversationEnd = false;
            }
        } else {
            // When the user is not at the bottom of the conversation, we only stick to the bottom
            // when the user scrolls down and reaches the bottom.
            if (scrollDirection === 'down' && scrolledToBottom) {
                scrollingStickToConversationEnd = true;
            }
        }
    }), 50);

    const initConversationContainer = (newConversationContainer: HTMLElement) => {
        newConversationContainer.addEventListener('scroll', scrollHandler);
    };

    const resetConversationContainer = (oldConversationContainer?: HTMLElement) => {
        oldConversationContainer?.removeEventListener('scroll', scrollHandler);
    };

    const handleDoneWithSection = (sectionId: string) => {
        if (activeChatSection?.uid === sectionId) {
            resizeObserver?.disconnect();
            mutationObserver?.disconnect();
            activeChatSection = undefined;
            resizeObserver = undefined;
            mutationObserver = undefined;
        }
    };

    let resizeObserver: ResizeObserver | undefined;
    let mutationObserver: MutationObserver | undefined;

    const scrollToBottom = () => {
        // Using a very large number to make sure the scroll position is set to the bottom.
        // The alternative is to use scrollHeight, but that would result in an extra reflow - that can
        // be avoided by using a very large number.
        // Downside: if the scrollHeight is larger than the max value (50000 pixels), this will not work.
        conversationContainer?.scrollTo({
            top: 50000,
            behavior: 'instant',
        });
    };

    const handleActiveChatSectionResized = () => {
        if (conversationContainer && shouldScrollWhenGenerating && scrollingStickToConversationEnd) {
            scrollToBottom();
        }
    };

    const handleActiveChatSectionDomChanged = () => {
        handleActiveChatSectionResized();
    };

    initConversationContainer(conversationContainer);

    return {
        updateConversationContainer: (newConversationContainer: HTMLElement) => {
            resetConversationContainer(conversationContainer);
            initConversationContainer(newConversationContainer);
            conversationContainer = newConversationContainer;
        },
        updateProps: ({autoScroll}) => {
            shouldScrollWhenGenerating = autoScroll;
        },
        handleNewChatSegmentAdded: (sectionId, sectionContainer) => {
            if (activeChatSection) {
                resizeObserver?.disconnect();
                mutationObserver?.disconnect();
            }

            activeChatSection = {uid: sectionId, container: sectionContainer};

            resizeObserver = new ResizeObserver(handleActiveChatSectionResized);
            resizeObserver.observe(sectionContainer);

            mutationObserver = new MutationObserver(handleActiveChatSectionDomChanged);
            mutationObserver.observe(sectionContainer, {
                childList: true,
                subtree: true,
                characterData: true,
            });

            if (shouldScrollWhenGenerating) {
                scrollToBottom();
            }
        },
        handleChatSegmentRemoved: (sectionId) => handleDoneWithSection(sectionId),
        handleChatSegmentComplete: (sectionId) => handleDoneWithSection(sectionId),
        destroy: () => {
            if (activeChatSection) {
                handleDoneWithSection(activeChatSection.uid);
                activeChatSection = undefined;
            }

            resetConversationContainer(conversationContainer);
            conversationContainer = undefined;
        },
    };
};
