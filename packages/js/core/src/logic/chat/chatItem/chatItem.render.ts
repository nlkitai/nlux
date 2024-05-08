import {createMarkdownStreamParser, MarkdownStreamParser} from '../../../../../../extra/markdown/src';
import {createChatItemDom} from '../../../../../../shared/src/ui/ChatItem/create';
import {createMessageContent} from '../../../../../../shared/src/ui/Message/utils/createMessageContent';
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

    const messageContainer = getElement(root, '.nlux-comp-msg');
    if (!messageContainer) {
        throw new Error('Message container not found');
    }

    const streamingRoot = document.createElement('div');
    streamingRoot.classList.add('nlux-md-strm-root');

    const markdownContainer = document.createElement('div');
    markdownContainer.classList.add('nlux-md-cntr');
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
            updateMarkdownStreamRenderer: (newProps: Partial<CompChatItemProps>) => {
                markdownStreamProps = {
                    ...markdownStreamProps,
                    ...newProps,
                };

                initMarkdownStreamParser(markdownStreamProps);
            },
        },
        onDestroy: () => {
            root.remove();
            markdownStreamParser = undefined;
        },
    };
};
