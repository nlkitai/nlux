import {StreamedServerComponent} from '@shared/types/adapters/chat/serverComponentChatAdapter';
import {FC, FunctionComponent, isValidElement} from 'react';
import {ResponseRendererProps} from '../../../exports/messageOptions';
import {MarkdownSnapshotRenderer} from '../../MessageRenderer/MarkdownSnapshotRenderer';
import {ChatItemProps} from '../props';

export const useAssistantMessageRenderer = function <AiMsg>(
    props: ChatItemProps<AiMsg>,
): FunctionComponent {
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
            };

            return () => {
                const Comp = (messageOptions.responseRenderer as FC<ResponseRendererProps<AiMsg>>);
                return <Comp {...props} />;
            };
        }

        //
        // Batching data and displaying it in a custom renderer.
        //
        const isServerComponent = isValidElement(fetchedContent);
        const serverComponent = isServerComponent ?
            (fetchedContent as unknown as StreamedServerComponent)
            : undefined;

        const content: AiMsg[] = !fetchedContent
            ? []
            : (isServerComponent ? [] : [(fetchedContent as AiMsg)]);

        const props: ResponseRendererProps<AiMsg> = {
            uid,
            status: 'complete',
            dataTransferMode,
            contentType,
            content,
            serverComponent,
            serverResponse: fetchedServerResponse ? [fetchedServerResponse] : [],
        };

        return () => {
            const Comp = (messageOptions.responseRenderer as FC<ResponseRendererProps<AiMsg>>);
            return <Comp {...props} />;
        };
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

    if (isValidElement(fetchedContent)) {
        return () => <>{fetchedContent}</>;
    }

    // No custom renderer and message is not a string!
    return () => '';
};
