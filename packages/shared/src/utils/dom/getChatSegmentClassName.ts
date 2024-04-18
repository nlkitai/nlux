import {ChatSegmentStatus} from '../../types/chatSegment/chatSegment';

export const getChatSegmentClassName = (status: ChatSegmentStatus): string => {
    const baseClassName = 'nlux-chtSgm';
    if (status === 'complete') {
        return `${baseClassName} nlux-chtSgm-cmpl`;
    }

    if (status === 'error') {
        return `${baseClassName} nlux-chtSgm-err`;
    }

    // Active status
    return `${baseClassName} nlux-chtSgm-actv`;
};
