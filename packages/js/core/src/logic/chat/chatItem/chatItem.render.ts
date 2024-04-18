import {createChatItemDom} from '../../../../../../shared/src/ui/ChatItem/create';
import {CompRenderer} from '../../../types/comp';
import {CompChatItemActions, CompChatItemElements, CompChatItemEvents, CompChatItemProps} from './chatItem.types';

export const renderChatItem: CompRenderer<
    CompChatItemProps, CompChatItemElements, CompChatItemEvents, CompChatItemActions
> = ({
    props,
    appendToRoot,
}) => {

    const root = createChatItemDom(props.domProps);
    appendToRoot(root);

    return {
        elements: {
            chatItemContainer: root,
        },
        actions: {
            focus: () => {
                root.focus();
            },
        },
        onDestroy: () => {
            root.remove();
        },
    };
};
