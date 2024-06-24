import React, {FC, RefObject} from 'react';
import {ResponseRendererProps} from '../../exports/messageOptions';
import {ChatItemProps} from '../ChatItem/props';
import {MarkdownSnapshotRenderer} from './MarkdownSnapshotRenderer';
import {StreamedServerComponent} from '@shared/types/adapters/chat/serverComponentChatAdapter';

//
// Returns a function component that renders the message content.
//
export const getMessageRenderer: <AiMsg>(
    props: ChatItemProps<AiMsg>,
    containerRef?: RefObject<HTMLElement>,
) => FC<object> = function <AiMsg>(
    props: ChatItemProps<AiMsg>,
    containerRef?: RefObject<HTMLElement>,
) {
    const {
        uid,
        status,
        dataTransferMode,
        contentType,
        fetchedContent,
        streamedContent,
        streamedServerResponse,
        fetchedServerResponse,
        direction,
        messageOptions,
    } = props;

    // For custom renderer — When the dataTransferMode is 'streaming', the message is undefined and a containerRef
    // must be provided. The containerRef is used to append the streaming message to the container.
    // When the dataTransferMode is 'batch', the message is defined and the containerRef is not needed.
    const containerRefToUse = containerRef ?? {current: null} satisfies RefObject<HTMLElement>;

    //
    // A custom response renderer is provided by the user.
    //
    if (messageOptions?.responseRenderer !== undefined) {
        //
        // Streaming into a custom renderer.
        //
        if (dataTransferMode === 'stream') {
            const props: ResponseRendererProps<AiMsg> = {
                uid,
                status,
                dataTransferMode,
                contentType,
                content: streamedContent ?? [],
                serverResponse: streamedServerResponse ?? [],
                containerRef: containerRefToUse as RefObject<never>,
            };

            return () => {
                const Comp = (messageOptions.responseRenderer as FC<ResponseRendererProps<AiMsg>>);
                return <Comp {...props} />;
            };
        } else {
            //
            // Batching data and displaying it in a custom renderer.
            //
            const isServerComponent = React.isValidElement(fetchedContent);
            const content: AiMsg[] | StreamedServerComponent = !fetchedContent
                ? []
                : (isServerComponent ? fetchedContent : [fetchedContent]);

            const props: ResponseRendererProps<AiMsg> = {
                uid,
                status: 'complete',
                dataTransferMode,
                contentType,
                content,
                serverResponse: fetchedServerResponse ? [fetchedServerResponse] : [],
            };

            return () => {
                const Comp = (messageOptions.responseRenderer as FC<ResponseRendererProps<AiMsg>>);
                return <Comp {...props} />;
            };
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
                    syntaxHighlighter: messageOptions?.syntaxHighlighter,
                    htmlSanitizer: messageOptions?.htmlSanitizer,
                    markdownLinkTarget: messageOptions?.markdownLinkTarget,
                    showCodeBlockCopyButton: messageOptions?.showCodeBlockCopyButton,
                    skipStreamingAnimation: messageOptions?.skipStreamingAnimation,
                }}
            />
        );
    }

    if (React.isValidElement(fetchedContent)) {
        return () => <>{fetchedContent}</>;
    }

    // No custom renderer and message is not a string!
    return () => '';
};
