export const messagesScrollHandlerFactory = (
    callback: (params: {scrolledToBottom: boolean}) => void,
) => {
    return (event: MouseEvent) => {
        const target = event.target as HTMLElement | null;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        const scrollTop = target.scrollTop;
        const clientHeight = target.clientHeight;
        const scrollHeight = target.scrollHeight;

        const minExpectedScrollTop = scrollHeight - 20;
        const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= minExpectedScrollTop

        callback({scrolledToBottom});
    };
};
