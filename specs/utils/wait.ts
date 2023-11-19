export const waitForRenderCycle = () => new Promise(resolve => {
    requestAnimationFrame(resolve);
});

export const waitForMilliseconds = (milliseconds: number) => new Promise(resolve => {
    setTimeout(resolve, milliseconds);
});

export const waitForMdStreamToComplete = (streamLength?: number) => new Promise(resolve => {
    const duration = streamLength ? streamLength * 10 : 200;
    setTimeout(resolve, duration);
});
