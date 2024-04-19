import {domOp} from '../../../../../../shared/src/utils/dom/domOp';
import {getChatSegmentClassName} from '../../../../../../shared/src/utils/dom/getChatSegmentClassName';
import {CompRenderer} from '../../../types/comp';
import {
    CompChatSegmentActions,
    CompChatSegmentElements,
    CompChatSegmentEvents,
    CompChatSegmentProps,
} from './chatSegment.types';

export const renderChatSegment: CompRenderer<
    CompChatSegmentProps, CompChatSegmentElements, CompChatSegmentEvents, CompChatSegmentActions
> = ({
    props,
    compEvent,
    appendToRoot,
}) => {

    // Create container
    const container = document.createElement('div');
    container.className = getChatSegmentClassName(props.status);
    appendToRoot(container);
    domOp(() => compEvent('chat-segment-ready')());

    return {
        elements: {
            chatSegmentContainer: container,
        },
        actions: {
            appendChatItem: (chatItemId: string, chatItem: HTMLElement) => {
                container.appendChild(chatItem);
            },
        },
        onDestroy: () => {
            container.remove();
        },
    };
};
