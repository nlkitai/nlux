import {ChatSegment} from '../../../../../../../../shared/src/types/chatSegment/chatSegment';
import {
    ChatSegmentCompleteCallback,
    ChatSegmentEventsMap,
} from '../../../../../../../../shared/src/types/chatSegment/chatSegmentEvents';
import {ChatSegmentObservable} from '../../../../../../../../shared/src/types/chatSegment/chatSegmentObservable';
import {uid} from '../../../../../../../../shared/src/utils/uid';
import {triggerAsyncCallback} from './triggerAsyncCallback';

export const createEmptyCompleteSegment = <AiMsg>(): {
    segment: ChatSegment<AiMsg>,
    observable: ChatSegmentObservable<AiMsg>,
} => {
    const completeListeners = new Set<
        ChatSegmentEventsMap<AiMsg>['complete']
    >();

    const segmentId = uid();

    const segment: ChatSegment<AiMsg> = {
        uid: segmentId,
        status: 'complete',
        items: [],
    };

    triggerAsyncCallback(() => {
        completeListeners.forEach((listener) => {
            listener(segment);
        });

        completeListeners.clear();
    });

    return {
        segment,
        observable: {
            on: (event, callback) => {
                if (event === 'complete') {
                    completeListeners.add(callback as unknown as ChatSegmentCompleteCallback<AiMsg>);
                }
            },
            removeListener: (event, callback) => {
                completeListeners.delete(callback as unknown as ChatSegmentCompleteCallback<AiMsg>);
            },
            destroy: () => {
                completeListeners.clear();
            },
            get segmentId(): string {
                return segmentId;
            },
        },
    };
};
