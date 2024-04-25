import {createMarkdownStreamParser} from '@nlux/markdown';
import {createChatItemDom} from '../../../../../../shared/src/ui/ChatItem/create';
import {CompRenderer} from '../../../types/comp';
import {getElement} from '../../../utils/dom/getElement';
import {CompChatItemActions, CompChatItemElements, CompChatItemEvents, CompChatItemProps} from './chatItem.types';

export const renderChatItem: CompRenderer<
    CompChatItemProps, CompChatItemElements, CompChatItemEvents, CompChatItemActions
> = ({
    props,
    appendToRoot,
}) => {

    const root = createChatItemDom(props.domProps);
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
    appendToRoot(root);

    const markdownStreamParser = createMarkdownStreamParser(markdownContainer, {
        openLinksInNewWindow: true,
        skipAnimation: false,
        syntaxHighlighter: undefined,
        streamingAnimationSpeed: undefined,
        onComplete: () => {
            // Do nothing
        },
    });

    return {
        elements: {
            chatItemContainer: root,
        },
        actions: {
            focus: () => {
                root.focus();
            },
            processStreamedChunk: (chunk: string) => {
                markdownStreamParser.next(chunk);
            },
        },
        onDestroy: () => {
            root.remove();
        },
    };
};
