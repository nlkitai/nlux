/**
 * In order to implement an optimized streaming experience, we cannot rely on React to manage the DOM elements
 * of the streaming messages. React UI is a function of state, and re-rendering the entire UI for every message
 * chunk would be inefficient. Instead, we use a service to manage the DOM elements of the streaming messages.
 *
 * This service creates a DOM element for each message ID and caches it. When a message ID is no longer needed,
 * the service deletes the DOM element. This way, we only have to update the DOM elements that are currently
 * visible on the screen.
 *
 * The NLUX stream renderer uses this service to obtain the DOM element for each message ID and will update them
 * in a very efficient way when new chunks are received.
 */

export type StreamingDomService = {
    getStreamingDomElement: (messageId: string) => HTMLDivElement;
    deleteStreamingDomElement: (messageId: string) => void;
};

export const streamingDomService: StreamingDomService = (() => {
    const streamingDomElementsByMessageId: Record<string, HTMLDivElement> = {};
    const victimMessageIds: Set<string> = new Set();

    return {
        getStreamingDomElement: (messageId: string) => {
            if (streamingDomElementsByMessageId[messageId] === undefined) {
                streamingDomElementsByMessageId[messageId] = document.createElement('div');
            }

            victimMessageIds.delete(messageId);
            return streamingDomElementsByMessageId[messageId];
        },
        deleteStreamingDomElement: (messageId: string) => {
            victimMessageIds.add(messageId);
            setTimeout(() => {
                victimMessageIds.forEach((victimMessageId) => {
                    if (streamingDomElementsByMessageId[victimMessageId]) {
                        streamingDomElementsByMessageId[victimMessageId].remove();
                        delete streamingDomElementsByMessageId[victimMessageId];
                    }
                });

                victimMessageIds.clear();
            }, 100);
        },
    };
})();
