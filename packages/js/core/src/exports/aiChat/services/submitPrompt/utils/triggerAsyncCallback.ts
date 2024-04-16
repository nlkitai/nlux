export const triggerAsyncCallback = (trigger: Function) => {
    setTimeout(() => {
        trigger();
    }, 1);
};
