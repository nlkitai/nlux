/**
 * A message component's possible statuses.
 *
 * - loading — A loader is displayed and the message property is ignored.
 * - streaming — A content of the message is handled by a DOM streaming service and the message property is ignored.
 * - rendered — The message component is in final state and the message text rendering complete (if provided).
 */
export type MessageStatus = 'loading' | 'streaming' | 'rendered';

export type MessageDirection = 'incoming' | 'outgoing';

export type MessageProps = {
    direction: MessageDirection;
    status: MessageStatus;
    loader?: HTMLElement;
    message?: string;
};
