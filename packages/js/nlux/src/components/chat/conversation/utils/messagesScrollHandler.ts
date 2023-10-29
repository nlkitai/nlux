export const messagesScrollHandlerFactory = (
    callback: (params: {scrolledToBottom: boolean}) => void,
) => {
    return (event: MouseEvent) => {
        const target = event.target as HTMLElement | null;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        const scrollHeight = target.scrollHeight;
        const scrollTop = target.scrollTop;
        const clientHeight = target.clientHeight;

        // We want to consider the user to have scrolled to the bottom if they are within a certain margin of error
        // of the bottom of the scrollable container. This is because we want to have a smoother experience for the
        // user, so we don't want to wait until they are exactly at the bottom of the scrollable container before
        // we consider them to have scrolled to the bottom.
        const scrollToBottomIntentionPercentage = 10;
        const scrollToBottomIntentionMinPixels = 40;
        const scrollToBottomIntentionMargin = Math.min(
            scrollHeight * (scrollToBottomIntentionPercentage / 100),
            scrollToBottomIntentionMinPixels,
        );

        const minExpectedScrollTop = scrollHeight - scrollToBottomIntentionMargin;

        let scrolledToBottom = false;
        if (Math.ceil(scrollTop + clientHeight) >= minExpectedScrollTop) {
            scrolledToBottom = true;
        }

        callback({scrolledToBottom});
    };
};
