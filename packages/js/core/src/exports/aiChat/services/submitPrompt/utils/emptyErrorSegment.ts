import {ChatSegment} from '../../../../../../../../shared/src/types/chatSegment/chatSegment';
import {
    ChatSegmentErrorCallback,
    ChatSegmentEventsMap,
} from '../../../../../../../../shared/src/types/chatSegment/chatSegmentEvents';
import {ChatSegmentObservable} from '../../../../../../../../shared/src/types/chatSegment/chatSegmentObservable';
import {NLErrorId} from '../../../../../../../../shared/src/types/exceptions/errors';
import {uid} from '../../../../../../../../shared/src/utils/uid';
import {triggerAsyncCallback} from './triggerAsyncCallback';

export const createEmptyErrorSegment = <AiMsg>(
    errorId: NLErrorId,
): {
    segment: ChatSegment<AiMsg>,
    observable: ChatSegmentObservable<AiMsg>,
} => {
    const errorListeners = new Set<
        ChatSegmentEventsMap<AiMsg>['error']
    >();

    const segmentId = uid();

    const segment: ChatSegment<AiMsg> = {
        uid: segmentId,
        status: 'error',
        items: [],
    };

    triggerAsyncCallback(() => {
        errorListeners.forEach((listener) => listener(errorId));
        errorListeners.clear();
    });

    return {
        segment,
        observable: {
            on: (event, callback) => {
                if (event === 'error') {
                    errorListeners.add(callback as unknown as ChatSegmentErrorCallback);
                }
            },
            removeListener: (event, callback) => {
                errorListeners.delete(callback as unknown as ChatSegmentErrorCallback);
            },
            destroy: () => {
                errorListeners.clear();
            },
            get segmentId(): string {
                return segmentId;
            },
        },
    };
};
