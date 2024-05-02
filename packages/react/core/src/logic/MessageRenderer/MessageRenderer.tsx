import {FC, RefObject} from 'react';
import {ChatItemProps} from '../../ui/ChatItem/props';
import {MarkdownSnapshotRenderer} from './MarkdownSnapshotRenderer';

export const createMessageRenderer: <AiMsg>(
    props: ChatItemProps<AiMsg>,
    containerRef?: RefObject<HTMLElement>,
) => FC<{}> = function <AiMsg>(
    props: ChatItemProps<AiMsg>,
    containerRef?: RefObject<HTMLElement>,
) {
    const {
        uid,
        status,
        message,
        direction,
        responseRenderer,
        syntaxHighlighter,
        openLinksInNewWindow,
    } = props;

    // For custom renderer — When the dataTransferMode is 'streaming', the message is undefined and a containerRef
    // must be provided. The containerRef is used to append the streaming message to the container.
    // When the dataTransferMode is 'fetch', the message is defined and the containerRef is not needed.
    const containerRefToUse = containerRef ?? {current: null} satisfies RefObject<HTMLElement>;

    if (responseRenderer !== undefined) {
        if (message === undefined) {
            return () => null;
        }

        return () => responseRenderer({
            uid,
            status,
            // We only pass the response to custom renderer when the status is 'complete'.
            response: status === 'complete' ? message as AiMsg : undefined,
            containerRef: containerRefToUse,
        });
    }

    if (direction === 'outgoing') {
        if (typeof message === 'string') {
            const messageToRender: string = message;
            return () => <>{messageToRender}</>;
        }

        return () => '';
    }

    if (typeof message === 'string') {
        const messageToRender: string = message;
        return () => (
            <MarkdownSnapshotRenderer
                messageUid={uid}
                content={messageToRender}
                markdownOptions={{
                    syntaxHighlighter,
                    openLinksInNewWindow,
                }}
            />
        );
    }

    // No custom renderer and message is not a string!
    return () => '';
};
