import {RefObject, useEffect, useMemo} from 'react';
import {ChatSegment} from '../../../../../../shared/src/types/chatSegment/chatSegment';
import {ChatSegmentImperativeProps} from '../../ChatSegment/props';

export const useChatSegmentsController = function <AiMsg>(
    segments: ChatSegment<AiMsg>[],
) {
    const chatSegmentsRef = useMemo(
        () => new Map<string, RefObject<ChatSegmentImperativeProps<any>>>(), [],
    );

    useEffect(() => {
        if (segments.length === 0) {
            chatSegmentsRef.clear();
            return;
        }

        const itemsInRefsMap = new Set<string>(chatSegmentsRef.keys());
        const itemsInSegments = new Set<string>(segments.map((segment) => segment.uid));
        for (const itemInRefsMap of itemsInRefsMap) {
            if (!itemsInSegments.has(itemInRefsMap)) {
                chatSegmentsRef.delete(itemInRefsMap);
            }
        }
    }, [segments]);

    return {
        get: (uid: string) => chatSegmentsRef.get(uid)?.current,
        getRef: (uid: string) => chatSegmentsRef.get(uid),
        set: (uid: string, ref: RefObject<ChatSegmentImperativeProps<any>>) => {
            chatSegmentsRef.set(uid, ref);
        },
        remove: (uid: string) => {
            chatSegmentsRef.delete(uid);
        },
    };
};
