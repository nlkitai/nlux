import {CompConversationScrollCallback} from '../conversation.types';

export const messagesScrollHandlerFactory = (callback: CompConversationScrollCallback) => {
    let lastScrollTop: number | undefined = undefined;
    let lastHeight: number | undefined = undefined;

    return (event: MouseEvent) => {
        const target = event.target as HTMLElement | null;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        const {
            scrollTop,
            clientHeight,
            scrollHeight,
        } = target;

        const minExpectedScrollTop = scrollHeight - 30;
        const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= minExpectedScrollTop

        const scrollDirection = (lastScrollTop === undefined || lastHeight === undefined) ? undefined :
            (scrollTop > lastScrollTop && lastHeight === scrollHeight) ? 'down' :
                (scrollTop < lastScrollTop && lastHeight === scrollHeight) ? 'up' :
                    undefined;

        lastHeight = scrollHeight;
        lastScrollTop = scrollTop;

        callback({scrolledToBottom, scrollDirection});
    };
};
