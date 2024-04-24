import {RefObject, useEffect, useMemo, useRef} from 'react';
import {ChatSegment} from '../../../../../../shared/src/types/chatSegment/chatSegment';

export const useLastActiveSegment = function <AiMsg>(
    segments: ChatSegment<AiMsg>[],
    lastSegmentContainerRef: RefObject<HTMLDivElement>,
    onLastActiveSegmentChange?: (data: {uid: string; div: HTMLDivElement} | undefined) => void,
) {
    const lastActiveSegmentId = useMemo(() => {
        const lastSegment = segments.length > 0 ? segments[segments.length - 1] : undefined;
        return lastSegment?.status === 'active' ? lastSegment.uid : undefined;
    }, [segments]);

    const lastCallbackData = useRef<{uid: string; div: HTMLDivElement} | undefined>(undefined);

    //
    // Whenever the last active segment div+id changes, call the onLastActiveSegmentChange callback
    // Since the div is not part of a component state, we need to use a ref to check every render cycle.
    // We use lastCallbackData to avoid calling the callback if the data hasn't changed.
    //

    useEffect(() => {
        if (!onLastActiveSegmentChange) {
            return;
        }

        const lastReportedData = lastCallbackData.current;
        if (lastActiveSegmentId === lastReportedData?.uid
            && lastSegmentContainerRef.current === lastReportedData?.div) {
            return;
        }

        const data = (lastActiveSegmentId && lastSegmentContainerRef.current) ? {
            uid: lastActiveSegmentId,
            div: lastSegmentContainerRef.current,
        } : undefined;

        if (!data && !lastCallbackData.current) {
            return;
        }

        onLastActiveSegmentChange(data);
        lastCallbackData.current = data;
    });

    // No dependencies on purpose — we want to run this effect on every render cycle
    // 'if' statements inside the effect will prevent unnecessary calls to the callback
};
