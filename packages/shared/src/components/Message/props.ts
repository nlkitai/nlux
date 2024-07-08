/**
 * A message component's possible statuses.
 *
 * - streaming — A content of the message is handled by a DOM streaming service and the message property is ignored.
 * - complete — A content of the message is fully loaded (either in fetch or stream mode). If present, the message
 * property is used to render the message.
 */
export type MessageStatus = 'streaming' | 'complete';

export type MessageDirection = 'received' | 'sent';

export type MessageProps = {
    direction: MessageDirection;
    status: MessageStatus;
    message?: string;
    format?: 'text' | 'markdown'; // Default is 'text'
    htmlSanitizer?: (html: string) => string;
};
