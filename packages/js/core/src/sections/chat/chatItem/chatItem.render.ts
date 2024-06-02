import {createMarkdownStreamParser, MarkdownStreamParser} from '../../../../../../extra/markdown/src';
import {createChatItemDom} from '@shared/components/ChatItem/create';
import {ChatItemProps} from '@shared/components/ChatItem/props';
import {updateChatItemDom} from '@shared/components/ChatItem/update';
import {createMessageContent} from '@shared/components/Message/utils/createMessageContent';
import {CompRenderer} from '../../../types/comp';
import {getElement} from '../../../utils/dom/getElement';
import {CompChatItemActions, CompChatItemElements, CompChatItemEvents, CompChatItemProps} from './chatItem.types';

export const renderChatItem: CompRenderer<
    CompChatItemProps, CompChatItemElements, CompChatItemEvents, CompChatItemActions
> = ({
         props,
         appendToRoot,
         compEvent,
     }) => {

    const root = createChatItemDom({
        ...props.domProps,
        message: undefined,
    });

    const messageContainer = getElement(root, '.nlux-comp-message');
    if (!messageContainer) {
        throw new Error('Message container not found');
    }

    const streamingRoot = document.createElement('div');
    streamingRoot.classList.add('nlux-markdownStream-root');

    const markdownContainer = document.createElement('div');
    markdownContainer.classList.add('nlux-markdown-container');
    markdownContainer.setAttribute('nlux-message-id', props.uid);

    streamingRoot.append(markdownContainer);
    messageContainer.append(streamingRoot);

    if (props.domProps.message) {
        const parsedMessage = createMessageContent(
            props.domProps.message ?? '',
            'markdown',
            {
                markdownLinkTarget: props.markdownLinkTarget,
                syntaxHighlighter: props.syntaxHighlighter,
                htmlSanitizer: props.htmlSanitizer,
            },
        );

        markdownContainer.append(parsedMessage);
    }

    appendToRoot(root);

    let markdownStreamParser: MarkdownStreamParser | undefined = undefined;
    let markdownStreamProps: CompChatItemProps = {...props};

    const initMarkdownStreamParser = (newProps: CompChatItemProps) => {
        return createMarkdownStreamParser(markdownContainer, {
            syntaxHighlighter: newProps.syntaxHighlighter,
            htmlSanitizer: newProps.htmlSanitizer,
            markdownLinkTarget: newProps.markdownLinkTarget,
            showCodeBlockCopyButton: newProps.showCodeBlockCopyButton,
            skipStreamingAnimation: newProps.skipStreamingAnimation,
            streamingAnimationSpeed: newProps.streamingAnimationSpeed,
            onComplete: () => compEvent('markdown-stream-complete'),
        });
    };

    return {
        elements: {
            chatItemContainer: root,
        },
        actions: {
            focus: () => {
                root.focus();
            },
            processStreamedChunk: (chunk: string) => {
                if (!markdownStreamParser) {
                    markdownStreamParser = initMarkdownStreamParser(markdownStreamProps);
                }

                markdownStreamParser.next(chunk);
            },
            commitStreamedChunks: () => {
                if (markdownStreamParser) {
                    markdownStreamParser.complete();
                }
            },
            updateMarkdownStreamRenderer: (newProps: Partial<CompChatItemProps>) => {
                markdownStreamProps = {
                    ...markdownStreamProps,
                    ...newProps,
                };

                initMarkdownStreamParser(markdownStreamProps);
            },
            updateDomProps: (oldProps: ChatItemProps, newProps: ChatItemProps) => {
                updateChatItemDom(
                    root,
                    oldProps,
                    newProps,
                );
            },
        },
        onDestroy: () => {
            root.remove();
            markdownStreamParser = undefined;
        },
    };
};
