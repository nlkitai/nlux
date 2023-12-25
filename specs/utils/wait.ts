export const waitForRenderCycle = () => new Promise(resolve => {
    requestAnimationFrame(resolve);
});

export const waitForMilliseconds = (milliseconds: number) => new Promise(resolve => {
    setTimeout(resolve, milliseconds);
});

export const waitForMdStreamToComplete = (streamLength: number = 20) => new Promise(resolve => {
    const duration = streamLength * 10; // 10ms wait per character
    setTimeout(resolve, duration);
});

// In milliseconds
export const delayBeforeSendingResponse = 200;
export const shortDelayBeforeSendingResponse = 100;
