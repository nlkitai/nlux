import {ChatSegmentStatus} from '../../types/chatSegment/chatSegment';

export const getChatSegmentClassName = (status: ChatSegmentStatus): string => {
    const baseClassName = 'nlux-chatSegment';
    if (status === 'complete') {
        return `${baseClassName} nlux-chatSegment-cmpl`;
    }

    if (status === 'error') {
        return `${baseClassName} nlux-chatSegment-err`;
    }

    // Active status
    return `${baseClassName} nlux-chatSegment-actv`;
};
