import {throttle} from '../../utils/throttle';
import {AutoScrollController} from './type';
import {createConversationScrollHandler} from './utils/conversationScrollHandler';

export const createAutoScrollController = (
    newConversationContainer: HTMLElement,
    autoScroll: boolean,
): AutoScrollController => {
    let shouldScrollWhenGenerating: boolean = autoScroll;
    let conversationContainer: HTMLElement | undefined = newConversationContainer;
    let scrollingStickToConversationEnd: boolean = true;
    let activeChatSegment: { uid: string; container: HTMLElement } | undefined = undefined;

    const scrollHandler = throttle(createConversationScrollHandler((
        {
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

    const handleDoneWithSegment = (segmentId: string) => {
        if (activeChatSegment?.uid === segmentId) {
            resizeObserver?.disconnect();
            mutationObserver?.disconnect();
            activeChatSegment = undefined;
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

    const handleActiveChatSegmentResized = () => {
        if (conversationContainer && shouldScrollWhenGenerating && scrollingStickToConversationEnd) {
            scrollToBottom();
        }
    };

    const handleActiveChatSegmentDomChanged = () => {
        handleActiveChatSegmentResized();
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
        handleNewChatSegmentAdded: (segmentId, segmentContainer) => {
            if (activeChatSegment) {
                resizeObserver?.disconnect();
                mutationObserver?.disconnect();
            }

            activeChatSegment = {uid: segmentId, container: segmentContainer};

            resizeObserver = new ResizeObserver(handleActiveChatSegmentResized);
            resizeObserver.observe(segmentContainer);

            mutationObserver = new MutationObserver(handleActiveChatSegmentDomChanged);
            mutationObserver.observe(segmentContainer, {
                childList: true,
                subtree: true,
                characterData: true,
            });

            if (shouldScrollWhenGenerating) {
                scrollToBottom();
            }
        },
        handleChatSegmentRemoved: (segmentId) => handleDoneWithSegment(segmentId),
        handleChatSegmentComplete: (segmentId) => handleDoneWithSegment(segmentId),
        destroy: () => {
            if (activeChatSegment) {
                handleDoneWithSegment(activeChatSegment.uid);
                activeChatSegment = undefined;
            }

            resetConversationContainer(conversationContainer);
            conversationContainer = undefined;
        },
    };
};
