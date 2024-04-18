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
    appendToRoot(root);

    const messageContainer = getElement(root, '.nlux-comp-msg');

    return {
        elements: {
            chatItemContainer: root,
        },
        actions: {
            focus: () => {
                root.focus();
            },
            processStreamedChunk: (chunk: string) => {
                if (messageContainer) {
                    messageContainer.append(
                        document.createTextNode(chunk),
                    );
                }
            },
        },
        onDestroy: () => {
            root.remove();
        },
    };
};
