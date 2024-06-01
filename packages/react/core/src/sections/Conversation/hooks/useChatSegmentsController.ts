import {RefObject, useEffect, useMemo} from 'react';
import {ChatSegment} from '@shared/types/chatSegment/chatSegment';
import {ChatSegmentImperativeProps} from '../../ChatSegment/props';

export const useChatSegmentsController = function <AiMsg>(
    segments: ChatSegment<AiMsg>[],
) {
    const chatSegmentsRef = useMemo(
        () => new Map<string, RefObject<ChatSegmentImperativeProps<AiMsg>>>(), [],
    );

    useEffect(() => {
        if (segments.length === 0) {
            chatSegmentsRef.clear();
            return;
        }

        const itemsInRefsMap = new Set<string>(chatSegmentsRef.keys());
        const itemsInSegments = new Set<string>(segments.map((segment) => segment.uid));
        itemsInRefsMap.forEach((itemInRefsMap) => {
            if (!itemsInSegments.has(itemInRefsMap)) {
                chatSegmentsRef.delete(itemInRefsMap);
            }
        });
    }, [segments]);

    return {
        get: (uid: string) => chatSegmentsRef.get(uid)?.current,
        getRef: (uid: string) => chatSegmentsRef.get(uid),
        set: (uid: string, ref: RefObject<ChatSegmentImperativeProps<AiMsg>>) => {
            chatSegmentsRef.set(uid, ref);
        },
        remove: (uid: string) => {
            chatSegmentsRef.delete(uid);
        },
    };
};
