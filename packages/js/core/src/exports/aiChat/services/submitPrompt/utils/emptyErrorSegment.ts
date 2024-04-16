import {ChatSegment} from '../../../../../../../../shared/src/types/chatSegment/chatSegment';
import {
    ChatSegmentEventsMap,
    ChatSegmentExceptionCallback,
} from '../../../../../../../../shared/src/types/chatSegment/chatSegmentEvents';
import {ChatSegmentObservable} from '../../../../../../../../shared/src/types/chatSegment/chatSegmentObservable';
import {uid} from '../../../../../../../../shared/src/utils/uid';

export const createEmptyErrorSegment = <MessageType>(
    errorMessage: string,
): {
    segment: ChatSegment<MessageType>,
    observable: ChatSegmentObservable<MessageType>,
} => {
    const exceptionListeners = new Set<
        ChatSegmentEventsMap<MessageType>['exception']
    >();

    const segmentId = uid();

    const segment: ChatSegment<MessageType> = {
        uid: segmentId,
        status: 'error',
        items: [],
    };

    setTimeout(() => {
        exceptionListeners.forEach((listener) => {
            listener({
                type: 'error',
                message: errorMessage,
            });
        });

        exceptionListeners.clear();
    });

    return {
        segment,
        observable: {
            on: (event, callback) => {
                if (event === 'exception') {
                    exceptionListeners.add(callback as unknown as ChatSegmentExceptionCallback);
                }
            },
            removeListener: (event, callback) => {
                exceptionListeners.delete(callback as unknown as ChatSegmentExceptionCallback);
            },
            destroy: () => {
                exceptionListeners.clear();
            },
            get segmentId(): string {
                return segmentId;
            },
        },
    };
};
