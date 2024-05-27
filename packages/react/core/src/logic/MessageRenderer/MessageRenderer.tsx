import {FC, RefObject} from 'react';
import {BatchResponseComponentProps, StreamResponseComponentProps} from '../../exports/messageOptions';
import {ChatItemProps} from '../../ui/ChatItem/props';
import {MarkdownSnapshotRenderer} from './MarkdownSnapshotRenderer';

export const createMessageRenderer: <AiMsg>(
    props: ChatItemProps<AiMsg>,
    containerRef?: RefObject<HTMLElement>,
) => FC<object> = function <AiMsg>(
    props: ChatItemProps<AiMsg>,
    containerRef?: RefObject<HTMLElement>,
) {
    const {
        uid,
        dataTransferMode,
        status,
        fetchedContent,
        fetchedServerResponse,
        direction,
        responseRenderer,
        syntaxHighlighter,
        htmlSanitizer,
        markdownLinkTarget,
        showCodeBlockCopyButton,
    } = props;

    // For custom renderer — When the dataTransferMode is 'streaming', the message is undefined and a containerRef
    // must be provided. The containerRef is used to append the streaming message to the container.
    // When the dataTransferMode is 'batch', the message is defined and the containerRef is not needed.
    const containerRefToUse = containerRef ?? {current: null} satisfies RefObject<HTMLElement>;

    //
    // A custom response renderer is provided by the user.
    //
    if (responseRenderer !== undefined) {
        //
        // Streaming into a custom renderer.
        //
        if (dataTransferMode === 'stream') {
            const props: StreamResponseComponentProps<AiMsg> = {
                uid,
                status,
                dataTransferMode,
                containerRef: containerRefToUse as RefObject<never>,
            };

            return () => responseRenderer(props);
        } else {
            //
            // Batching data and displaying it in a custom renderer.
            //
            const props: BatchResponseComponentProps<AiMsg> = {
                uid,
                status: 'complete',
                content: fetchedContent as AiMsg,
                serverResponse: fetchedServerResponse,
                dataTransferMode,
            };

            return () => responseRenderer(props);
        }
    }

    if (direction === 'sent') {
        if (typeof fetchedContent === 'string') {
            const messageToRender: string = fetchedContent;
            return () => <>{messageToRender}</>;
        }

        return () => '';
    }

    if (typeof fetchedContent === 'string') {
        const messageToRender: string = fetchedContent;
        return () => (
            <MarkdownSnapshotRenderer
                messageUid={uid}
                content={messageToRender}
                markdownOptions={{
                    syntaxHighlighter,
                    htmlSanitizer,
                    markdownLinkTarget,
                    showCodeBlockCopyButton,
                }}
            />
        );
    }

    // No custom renderer and message is not a string!
    return () => '';
};
