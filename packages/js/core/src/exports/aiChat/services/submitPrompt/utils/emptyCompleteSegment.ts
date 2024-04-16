import {ChatSegment} from '../../../../../../../../shared/src/types/chatSegment/chatSegment';
import {
    ChatSegmentCompleteCallback,
    ChatSegmentEventsMap,
} from '../../../../../../../../shared/src/types/chatSegment/chatSegmentEvents';
import {ChatSegmentObservable} from '../../../../../../../../shared/src/types/chatSegment/chatSegmentObservable';
import {uid} from '../../../../../../../../shared/src/utils/uid';

export const createEmptyCompleteSegment = <MessageType>(): {
    segment: ChatSegment<MessageType>,
    observable: ChatSegmentObservable<MessageType>,
} => {
    const completeListeners = new Set<
        ChatSegmentEventsMap<MessageType>['complete']
    >();

    const segmentId = uid();

    const segment: ChatSegment<MessageType> = {
        uid: segmentId,
        status: 'complete',
        items: [],
    };

    setTimeout(() => {
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
                    completeListeners.add(callback as unknown as ChatSegmentCompleteCallback<MessageType>);
                }
            },
            removeListener: (event, callback) => {
                completeListeners.delete(callback as unknown as ChatSegmentCompleteCallback<MessageType>);
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
