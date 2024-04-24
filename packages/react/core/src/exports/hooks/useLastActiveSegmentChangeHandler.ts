import {MutableRefObject, useCallback} from 'react';
import {AutoScrollController} from '../../../../../shared/src/interactions/autoScroll/type';

export const useLastActiveSegmentChangeHandler = <AiMsg>(
    autoScrollController: AutoScrollController | undefined,
    lastActiveSegmentIdRef: MutableRefObject<string | undefined>,
) => {
    return useCallback((data: {uid: string; div: HTMLDivElement} | undefined) => {
        if (!autoScrollController) {
            return;
        }

        if (data) {
            lastActiveSegmentIdRef.current = data.uid;
            autoScrollController.handleNewChatSegmentAdded(data.uid, data.div);
        } else {
            if (lastActiveSegmentIdRef.current) {
                autoScrollController.handleChatSegmentRemoved(lastActiveSegmentIdRef.current);
            }
        }
    }, [autoScrollController]);
};
