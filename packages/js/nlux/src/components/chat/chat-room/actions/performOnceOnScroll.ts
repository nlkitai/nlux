export const performOnceOnScrollFactory = (
    scrollUpOnceListeners: Set<() => void>,
) => {
    return (direction: 'up', callback: () => void) => {
        if (direction !== 'up') {
            throw new Error(`Unsupported scroll direction by listener: ${direction}`);
        }

        scrollUpOnceListeners.add(callback);

        return () => {
            scrollUpOnceListeners.delete(callback);
        };
    };
};