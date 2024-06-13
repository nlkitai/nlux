import {useMemo} from 'react';

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

export type MarkdownContainersController = {
    getStreamingDomElement: (messageId: string) => HTMLDivElement;
    deleteStreamingDomElement: (messageId: string) => void;
};

export const usMarkdownContainers: () => MarkdownContainersController = () => {
    const streamingDomElementsByMessageId: Record<string, HTMLDivElement> = {};
    const victimMessageIds: Set<string> = new Set();
    const randomId = Math.random().toString(36).substring(7);

    return useMemo<MarkdownContainersController>(() => ({
        getStreamingDomElement: (messageId: string) => {
            console.dir(victimMessageIds);
            console.log('Service ID # ', randomId);

            if (victimMessageIds.has(messageId)) {
                victimMessageIds.delete(messageId);
            }

            if (streamingDomElementsByMessageId[messageId] === undefined) {
                const newStreamContainer = document.createElement('div');
                newStreamContainer.setAttribute('nlux-message-id', messageId);
                newStreamContainer.className = 'nlux-markdown-container';
                streamingDomElementsByMessageId[messageId] = newStreamContainer;
            }

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
            }, 1000);
        },
    }), []);
};
