import {ChatSegment} from '../../../types/chatSegment/chatSegment';
import {ChatSegmentErrorCallback, ChatSegmentEventsMap} from '../../../types/chatSegment/chatSegmentEvents';
import {ChatSegmentObservable} from '../../../types/chatSegment/chatSegmentObservable';
import {NLErrorId} from '../../../types/exceptions/errors';
import {uid} from '../../../utils/uid';
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
