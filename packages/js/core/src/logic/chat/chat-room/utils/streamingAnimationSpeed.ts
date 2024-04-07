import {markdownDefaultStreamingAnimationSpeed} from '../../../../exports/aiChat/markdown/streamParser';

export const getStreamingAnimationSpeed = (streamingAnimationSpeed?: number | null) => {
    // undefined => default animation speed
    // value => custom animation speed
    // null => no animation
    if (streamingAnimationSpeed === undefined) {
        return markdownDefaultStreamingAnimationSpeed;
    }

    return streamingAnimationSpeed === null ? 0 : streamingAnimationSpeed;
};
