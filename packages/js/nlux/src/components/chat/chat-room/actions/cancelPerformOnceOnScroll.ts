export const cancelPerformOnceOnScrollFactory = (
    scrollUpOnceListeners: Set<() => void>,
) => {
    return (callback: () => void) => {
        scrollUpOnceListeners.delete(callback);
    };
};
