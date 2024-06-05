import {act} from 'react';

export const waitForRenderCycle = async () => new Promise(resolve => {
    requestAnimationFrame(resolve);
});

export const waitForReactRenderCycle = async () => {
    const animationFramePromise = new Promise(resolve => {
        requestAnimationFrame(resolve);
    });

    await act(() => animationFramePromise);
};

export const waitForMilliseconds = (milliseconds: number) => new Promise(resolve => {
    setTimeout(resolve, milliseconds);
});

export const waitForMdStreamToComplete = (streamLength: number = 20) => new Promise(resolve => {
    const duration = streamLength * 5; // 10ms wait per character
    setTimeout(resolve, duration);
});
