export const waitForRenderCycle = () => new Promise(resolve => {
    requestAnimationFrame(resolve);
});

export const waitForMilliseconds = (milliseconds: number) => new Promise(resolve => {
    setTimeout(resolve, milliseconds);
});
